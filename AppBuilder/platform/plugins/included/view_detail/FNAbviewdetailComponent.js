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
         return {
            type: "form",
            id: this.ids.component,
            borderless: true,
            rows: [{ body: _ui }],
         };
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

         // Ensure detail field data-cy for Cypress; run with delays so DOM is ready
         [0, 150, 400].forEach((ms) =>
            setTimeout(() => this._setDetailFieldDataCy(), ms)
         );
      }

      /**
       * Set data-cy on each detail field element so e2e tests can find them.
       * Format matches core ABViewDetail*Component.
       * Lookup: use ids that were actually used in the DOM (viewComponentIDs when
       * available) and resolve the Webix view before accessing $view.
       */
      _setDetailFieldDataCy() {
         if (!ContainerComponent || !this.viewComponents) return;
         const viewList = this.view.views() || [];
         const viewComponentIDs = this.viewComponentIDs || {};

         Object.keys(this.viewComponents).forEach((viewId) => {
            const comp = this.viewComponents[viewId];
            const f = viewList.find((v) => v.id === viewId);
            if (!comp || !f) return;

            try {
               const parentId =
                  f.parentDetailComponent?.()?.id || f.parent?.id || "";
               const field = f.field?.();
               const settings = f.settings || {};
               const columnName =
                  f.key === "detail_connect"
                     ? (f.field?.((fl) => fl.id === settings.fieldId)?.columnName ?? "")
                     : (field?.columnName ?? "");
               const fieldId = field?.id ?? settings.fieldId ?? "";

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

               if (!dataCy) return;

               const rootId =
                  viewComponentIDs[viewId] ?? comp.ids?.component;
               const detailItemId = comp.ids?.detailItem;

               const webixRoot = rootId ? $$(rootId) : null;
               const webixDetailItem =
                  detailItemId && !useRoot ? $$(detailItemId) : null;

               const el = useRoot
                  ? webixRoot?.$view
                  : webixDetailItem?.$view;
               if (!el || !el.setAttribute) return;

               const isDetailItem = !useRoot && webixDetailItem;
               const target =
                  isDetailItem && el.parentNode ? el.parentNode : el;
               target.setAttribute("data-cy", dataCy);
            } catch (e) {
               console.warn("Problem setting detail field data-cy", e);
            }
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

            const vComponent = f.component(this.idBase);
            vComponent?.setValue?.(val);
            vComponent?.displayText?.(rowData);
         });

         // Keep data-cy in sync for e2e (e.g. after cursor change)
         setTimeout(() => this._setDetailFieldDataCy(), 0);
      }
   };
}
