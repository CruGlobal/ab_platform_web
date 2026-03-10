export default function FNAbviewdetailComponent({
   ABViewContainerComponent,
   ABViewComponentPlugin,
}) {
   const ContainerComponent =
      ABViewContainerComponent?.default ?? ABViewContainerComponent;
   const Base = ContainerComponent ?? ABViewComponentPlugin;
   if (!Base) {
      return class ABAbviewdetailComponent {};
   }

   return class ABAbviewdetailComponent extends Base {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewDetail_${baseView.id}`,
            Object.assign({ detail: "" }, ids)
         );
         this.idBase = idBase || `ABViewDetail_${baseView.id}`;
      }

      ui() {
         if (!ContainerComponent) {
            return this._uiDataviewFallback();
         }
         const _ui = super.ui();
         const hasContent = (this.view.views() || []).length > 0;
         return {
            type: "form",
            id: this.ids.component,
            borderless: true,
            minHeight: hasContent ? undefined : 120,
            rows: [{ body: _ui }],
         };
      }

      /**
       * Override getElements to inject data-cy into each child view config (like Carousel does in init).
       * Webix applies attributes when the view is created, so this avoids timing issues in tabs/CI.
       */
      getElements(views) {
         const rows = [];
         const componentMap = {};
         let curRowIndex;
         let curColIndex;
         const settings = this.settings;
         const defaultSettings = this.view.constructor.defaultValues();

         views.forEach((v) => {
            let component;
            try {
               component = v.component(this.idBase);
               v.removeAllListeners("changePage");
            } catch (err) {
               component = v.component(this.idBase);
               const ui = component.ui;
               component.ui = (() => ui).bind(component);
            }

            this.viewComponents[v.id] = component;

            if (v.position.y == null || v.position.y !== curRowIndex) {
               curRowIndex = v.position.y || rows.length;
               curColIndex = 0;
               const rowNew = { cols: [] };
               const colNumber = settings.columns || defaultSettings.columns;
               for (let i = 0; i < colNumber; i++)
                  rowNew.cols.push({
                     gravity: settings.gravity?.[i]
                        ? parseInt(settings.gravity[i])
                        : defaultSettings.gravity,
                  });
               rows.push(rowNew);
            }

            const rowIndx = rows.length - 1;
            const curRow = rows[rowIndx];
            const newPos = v.position.x ?? 0;
            const mapKey = `${rowIndx}-${newPos}`;
            let getGrav = 1;
            if (componentMap[mapKey])
               console.error(
                  `Component[${component?.ids?.component}] is overwriting component[${componentMap[mapKey].ids?.component}]. <-- Reorder them to fix.`
               );
            componentMap[mapKey] = component;
            if (curRow.cols[newPos]?.gravity)
               getGrav = curRow.cols[newPos].gravity;

            const _ui = component.ui();
            const info = this._dataCyForView(v);
            if (info?.dataCy) {
               const dataCy = info.dataCy;
               const useRoot = info.useRoot;
               const detailItemId = component.ids?.detailItem;
               _ui.attributes = Object.assign({}, _ui.attributes, {
                  "data-cy": dataCy,
               });
               const prevOnAfterRender = _ui.on?.onAfterRender;
               _ui.on = _ui.on || {};
               _ui.on.onAfterRender = function () {
                  if (typeof prevOnAfterRender === "function")
                     prevOnAfterRender.call(this);
                  try {
                     let node;
                     if (useRoot) {
                        node =
                           (typeof $$ !== "undefined" && $$(this.config?.id)?.$view) ||
                           (typeof document !== "undefined" &&
                              this.config?.id &&
                              document.getElementById(this.config.id));
                     } else if (detailItemId) {
                        node =
                           (typeof $$ !== "undefined" && $$(detailItemId)?.$view) ||
                           (typeof document !== "undefined" &&
                              document.getElementById(detailItemId));
                     }
                     if (node?.setAttribute) node.setAttribute("data-cy", dataCy);
                  } catch (e) {}
               };
            }

            this.viewComponentIDs[v.id] = _ui.id;
            _ui.gravity = getGrav;
            curRow.cols[newPos] = _ui;

            this.eventAdd({
               emitter: v,
               eventName: "changePage",
               listener: this._handlerChangePage,
            });
            curColIndex++;
         });

         return rows;
      }

      _uiDataviewFallback() {
         const settings = this.settings;
         const _uiDetail = {
            id: this.ids.detail,
            view: "dataview",
            type: { width: 1000, height: 30 },
            template: (item) => (item ? JSON.stringify(item) : ""),
         };
         if (settings.height !== 0) _uiDetail.height = settings.height;
         else _uiDetail.autoHeight = true;
         const _ui = super.ui([_uiDetail]);
         delete _ui.type;
         return _ui;
      }

      async init(AB, accessLevel = 0, options = {}) {
         await super.init(AB, accessLevel, options);
         try {
            this._setDetailFieldDataCy();
         } catch (e) {
            console.warn("Detail _setDetailFieldDataCy (init)", e);
         }
      }

      onShow() {
         const baseView = this.view;
         try {
            const dataCy = `Detail ${baseView.name?.split(".")[0]} ${baseView.id}`;
            $$(this.ids.component)?.$view?.setAttribute("data-cy", dataCy);
         } catch (e) {
            console.warn("Problem setting data-cy", e);
         }

         const dv = this.datacollection;
         if (dv) {
            const currData = dv.getCursor();
            if (currData) this.displayData(currData);

            ["changeCursor", "cursorStale", "collectionEmpty"].forEach((key) => {
               this.eventAdd({
                  emitter: dv,
                  eventName: key,
                  listener: (...p) => this.displayData(...p),
               });
            });
            this.eventAdd({
               emitter: dv,
               eventName: "create",
               listener: (createdRow) => {
                  if (dv.getCursor()?.id === createdRow.id)
                     this.displayData(createdRow);
               },
            });
            this.eventAdd({
               emitter: dv,
               eventName: "update",
               listener: (updatedRow) => {
                  if (dv.getCursor()?.id === updatedRow.id)
                     this.displayData(updatedRow);
               },
            });
         }

         super.onShow?.();

         try {
            this._setDetailFieldDataCy();
         } catch (e) {
            console.warn("Detail _setDetailFieldDataCy (sync)", e);
         }
         if (typeof requestAnimationFrame !== "undefined") {
            requestAnimationFrame(() => {
               try {
                  this._setDetailFieldDataCy();
               } catch (err) {
                  console.warn("Detail _setDetailFieldDataCy (rAF)", err);
               }
            });
         }
         [0, 100, 300, 600, 1200].forEach((ms) =>
            setTimeout(() => {
               try {
                  this._setDetailFieldDataCy();
               } catch (err) {
                  console.warn("Detail _setDetailFieldDataCy (timeout)", err);
               }
            }, ms)
         );
      }

      /** Build data-cy string for a detail view (matches core). Values trimmed for exact e2e match. */
      _dataCyForView(f) {
         const parentId = String(
            f.parentDetailComponent?.()?.id || f.parent?.id || ""
         ).trim();
         const field = f.field?.();
         const settings = f.settings || {};
         const columnName = String(
            f.key === "detail_connect"
               ? (f.field?.((fl) => fl.id === settings.fieldId)?.columnName ?? "")
               : (field?.columnName ?? "")
         ).trim();
         const fieldId = String(field?.id ?? settings.fieldId ?? "").trim();

         let dataCy = "";
         let useRoot = false;
         switch (f.key) {
            case "detail_text":
               dataCy = `detail text ${columnName} ${fieldId} ${parentId}`;
               useRoot = true;
               break;
            case "detail_connect":
               dataCy = `detail connected ${columnName} ${fieldId} ${parentId}`;
               break;
            case "detail_checkbox":
               dataCy = `detail checkbox ${columnName} ${fieldId} ${parentId}`;
               break;
            case "detail_image":
               dataCy = `detail image ${columnName} ${fieldId} ${parentId}`;
               break;
            case "detail_custom":
               dataCy = `detail custom ${columnName} ${fieldId} ${parentId}`;
               break;
            case "detail_selectivity":
               dataCy = `detail selectivity ${columnName} ${fieldId} ${parentId}`;
               break;
            default:
               dataCy = `detail text ${columnName} ${fieldId} ${parentId}`;
               useRoot = true;
         }
         return dataCy ? { dataCy, useRoot } : null;
      }

      /** Set data-cy on one component; use $$(id) or document.getElementById so CI finds element. */
      _setDataCyOnComponent(comp, _f, { dataCy, useRoot }) {
         if (!comp?.ids || !dataCy) return;
         try {
            const id = useRoot ? comp.ids.component : comp.ids.detailItem;
            if (!id) return;
            let el =
               typeof $$ !== "undefined" && $$(id)?.$view
                  ? $$(id).$view
                  : null;
            if (!el && typeof document !== "undefined")
               el = document.getElementById(id);
            if (!el?.setAttribute) return;
            const target =
               !useRoot && el.parentNode ? el.parentNode : el;
            target.setAttribute("data-cy", dataCy);
         } catch (e) {
            console.warn("Problem setting detail field data-cy", e);
         }
      }

      /** Set data-cy on all detail fields; try comp.ids then viewComponentIDs then getElementById. */
      _setDetailFieldDataCy() {
         if (!ContainerComponent || !this.viewComponents) return;
         const viewList = this.view.views() || [];
         const viewComponentIDs = this.viewComponentIDs || {};

         Object.keys(this.viewComponents).forEach((viewId) => {
            const comp = this.viewComponents[viewId];
            const f = viewList.find((v) => v.id === viewId);
            if (!comp || !f) return;

            const info = this._dataCyForView(f);
            if (!info) return;

            const id =
               (info.useRoot
                  ? comp.ids?.component
                  : comp.ids?.detailItem) ||
               viewComponentIDs[viewId];
            if (!id) return;

            let el =
               typeof $$ !== "undefined" && $$(id)?.$view
                  ? $$(id).$view
                  : null;
            if (!el && typeof document !== "undefined")
               el = document.getElementById(id);
            if (!el?.setAttribute) return;

            const target =
               !info.useRoot && el.parentNode ? el.parentNode : el;
            target.setAttribute("data-cy", info.dataCy);
         });
      }

      displayData(rowData = {}) {
         if (!ContainerComponent) return;
         if (rowData == null && this.datacollection)
            rowData = this.datacollection.getCursor() ?? {};

         const views = (this.view.views() || []).sort((a, b) => {
            if (!a?.field?.() || !b?.field?.()) return 0;
            if (a.field().key === "formula" && b.field().key === "calculate")
               return -1;
            if (a.field().key === "calculate" && b.field().key === "formula")
               return 1;
            return 0;
         });

         views.forEach((f) => {
            let val;
            if (f.field) {
               const field = f.field();
               if (!field) return;

               switch (field.key) {
                  case "connectObject":
                     val = field.pullRelationValues(rowData);
                     break;
                  case "list":
                     val = rowData?.[field.columnName];
                     if (!val) {
                        val = "";
                        break;
                     }
                     if (field.settings.isMultiple === 0) {
                        let myVal = "";
                        (field.settings.options || []).forEach((opt) => {
                           if (opt.id === val) myVal = opt.text;
                        });
                        if (field.settings.hasColors) {
                           let hasCustomColor = "";
                           (field.settings.options || []).forEach((h) => {
                              if (h.text === myVal) {
                                 hasCustomColor = "hascustomcolor";
                              }
                           });
                           const hex = (field.settings.options || []).find(
                              (o) => o.text === myVal
                           )?.hex ?? "#66666";
                           myVal = `<span class="webix_multicombo_value ${hasCustomColor}" style="background-color: ${hex} !important;"><span>${myVal}</span></span>`;
                        }
                        val = myVal;
                     } else {
                        const items = (val || []).map((value) => {
                           let myVal = "";
                           (field.settings.options || []).forEach((opt) => {
                              if (opt.id === value.id) myVal = opt.text;
                           });
                           const optionHex =
                              field.settings.hasColors && value.hex
                                 ? `background: ${value.hex};`
                                 : "";
                           const hasCustomColor =
                              field.settings.hasColors && value.hex
                                 ? "hascustomcolor"
                                 : "";
                           return `<span class="webix_multicombo_value ${hasCustomColor}" style="${optionHex}" optvalue="${value.id}"><span>${myVal}</span></span>`;
                        });
                        val = items.join("");
                     }
                     break;
                  case "user":
                     val = field.pullRelationValues(rowData);
                     break;
                  case "file":
                     val = rowData?.[field.columnName] ?? "";
                     break;
                  case "formula":
                     val = rowData ? field.format(rowData, false) : "";
                     break;
                  default:
                     val = field.format(rowData);
               }
            }

            const vComponent =
               this.viewComponents?.[f.id] ?? f.component(this.idBase);
            vComponent?.setValue?.(val);
            vComponent?.displayText?.(rowData);

            try {
               const dataCyInfo = this._dataCyForView(f);
               if (dataCyInfo)
                  this._setDataCyOnComponent(vComponent, f, dataCyInfo);
            } catch (e) {
               console.warn("Detail data-cy in displayData", e);
            }
         });

         [0, 100, 400].forEach((ms) =>
            setTimeout(() => this._setDetailFieldDataCy(), ms)
         );
      }
   };
}
