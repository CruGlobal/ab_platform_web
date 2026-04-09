import ABViewPropertyLinkPageLocal from "./ABViewPropertyLinkPageLocal.js";

function FNAbviewdataviewDetailComponent({
   ABViewContainerComponent,
   ABViewComponentPlugin,
}) {
   const ContainerComponent =
      ABViewContainerComponent?.default ?? ABViewContainerComponent;
   const Base = ContainerComponent ?? ABViewComponentPlugin;

   return class ABAbviewdataviewDetailComponent extends Base {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewDetail_${baseView.id}`,
            Object.assign({ detail: "" }, ids)
         );
         this.idBase = idBase || `ABViewDetail_${baseView.id}`;
      }

      displayData(rowData = {}) {
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
                     if (!val || (Array.isArray(val) && val.length === 0)) {
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
                              if (h.text === myVal) hasCustomColor = "hascustomcolor";
                           });
                           const hex = (field.settings.options || []).find(
                              (o) => o.text === myVal
                           )?.hex;
                           myVal = `<span class="webix_multicombo_value ${hasCustomColor}" style="background-color: ${hex || "#66666"} !important;"><span>${myVal}</span></span>`;
                        }
                        val = myVal;
                     } else {
                        const items = val.map((value) => {
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
         });
      }
   };
}

export default function FNAbviewdataviewComponent({
   ABViewContainerComponent,
   ABViewComponentPlugin,
}) {
   const DetailComponent = FNAbviewdataviewDetailComponent({
      ABViewContainerComponent,
      ABViewComponentPlugin,
   });

   return class ABAbviewdataviewComponent extends ABViewComponentPlugin {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewDataview_${baseView.id}`,
            Object.assign(
               {
                  dataview: "",
                  reload: "",
               },
               ids
            )
         );

         this.linkPage = null;
      }

      ui() {
         // Initialize detail component here because item template depends
         // on rendered width/height values from its generated card UI.
         this.initDetailComponent();

         const ids = this.ids;
         const L = (...params) => (this.AB ?? AB).Multilingual.label(...params);
         return super.ui([
            {
               view: "layout",
               rows: [
                  {
                     id: ids.reload,
                     view: "button",
                     value: L("New data available. Click to reload."),
                     css: "webix_primary webix_warn",
                     hidden: true,
                     click: () => {
                        this.reloadData();
                     },
                  },
                  {
                     id: ids.dataview,
                     view: "dataview",
                     scroll: "y",
                     sizeToContent: true,
                     css: "borderless transparent",
                     xCount: this.settings.xCount != 1 ? this.settings.xCount : 0,
                     height: this.settings.height,
                     template: (item) => this.itemTemplate(item),
                     on: {
                        // Tab/multiview can show the dataview after init; re-apply cy + handlers.
                        onViewShow: () => {
                           this.addCyAttribute();
                           this.applyClickEvent();
                           this.resize();
                        },
                        onAfterRender: () => {
                           this.applyClickEvent();
                           this.addCyAttribute();
                        },
                     },
                  },
               ],
            },
         ]);
      }

      async init(AB) {
         await super.init(AB);

         const $dataView = $$(this.ids.dataview);
         // data-cy on the container must not wait for DC bind or onAfterRender;
         // slow CI can otherwise race Cypress before the first dataview paint.
         if ($dataView) {
            this.addCyAttribute();
            AB.Webix.extend($dataView, AB.Webix.ProgressBar);
         }

         const dc = this.datacollection;
         if (!$dataView) return;

         // Card field components need AB + full async init before the first bind-driven
         // template pass (init(null, 2) from ui() is too early). Single init here, after AB exists.
         const detailInit = this.detailComponent.init(AB, 2);
         if (detailInit && typeof detailInit.then === "function") {
            await detailInit;
         }

         if (!dc) return;

         this.linkPage = this.linkPageHelper.component();
         this.linkPage.init({
            view: this.view,
            datacollection: dc,
         });

         dc.bind($dataView);

         this.initRefreshWarning();

         window.addEventListener("resize", () => {
            clearTimeout(this._resizeEvent);
            this._resizeEvent = setTimeout(() => {
               const $dv = $$(this.ids.dataview);
               if ($dv) this.resize($dv.getParentView());
               delete this._resizeEvent;
            }, 20);
         });
      }

      initRefreshWarning() {
         const dc = this.datacollection;
         const includeInQuery =
            (dc?.settings?.objectWorkspace?.filterConditions?.rules ?? []).filter(
               (r) =>
                  [
                     "in_query",
                     "not_in_query",
                     "in_query_field",
                     "not_in_query_field",
                  ].includes(r.rule)
            ).length > 0;

         if (!includeInQuery) return;

         ["ab.datacollection.create", "ab.datacollection.update", "ab.datacollection.delete"].forEach(
            (eventKey) => {
               dc.on(eventKey, (data) => {
                  if (data.objectId == dc.datasource.id) this.showRefreshWarning();
               });
            }
         );
      }

      showRefreshWarning() {
         if (this.__throttleRefreshWarning)
            clearTimeout(this.__throttleRefreshWarning);
         this.__throttleRefreshWarning = setTimeout(() => {
            $$(this.ids.reload)?.show();
         }, 200);
      }

      reloadData() {
         this.datacollection?.reloadData();
         $$(this.ids.reload)?.hide();
      }

      onShow() {
         super.onShow();
         this.resize();
      }

      resize(baseElement) {
         const $dataview = $$(this.ids.dataview);
         if (!$dataview) {
            this.AB.notify.developer(
               new Error("Resize called on missing dataview component"),
               { context: "ABViewDataviewComponent.resize()", ids: this.ids }
            );
            return;
         }

         $dataview.resize();
         const itemWidth = this.getItemWidth(baseElement);
         $dataview.customize({ width: itemWidth });
         $dataview.getTopParentView?.().resize?.();
      }

      initDetailComponent() {
         // Build the detached card UI only; field inits run in init(AB) with a real AB
         // and complete before datacollection.bind so itemTemplate sees ready sub-widgets.
         this._detail_ui = this.AB.Webix.ui(this.getDetailUI());
      }

      getDetailUI() {
         const detailCom = this.detailComponent;
         const _ui = detailCom.ui();
         _ui.type = "clean";
         _ui.css = "ab-detail-view";

         if (this.settings.detailsPage || this.settings.editPage) {
            _ui.css += " ab-detail-hover ab-record-#itemId#";
            if (this.settings.detailsPage) _ui.css += " ab-detail-page";
            if (this.settings.editPage) _ui.css += " ab-edit-page";
         }

         return _ui;
      }

      itemTemplate(item) {
         const detailCom = this.detailComponent;
         const $dataview = $$(this.ids.dataview);
         const $detailItem = this._detail_ui;

         // Mock data ensures card template has dimensions before data exists.
         if (!item || !Object.keys(item).length) {
            item = {
               id: "__ab_dataview_sizing__",
               uuid: "__ab_dataview_sizing__",
               ...(item ?? {}),
            };
            this.datacollection?.datasource?.fields().forEach((f) => {
               switch (f.key) {
                  case "string":
                  case "LongText":
                     item[f.columnName] = "Lorem Ipsum";
                     break;
                  case "date":
                  case "datetime":
                     item[f.columnName] = new Date();
                     break;
                  case "number":
                     item[f.columnName] = 7;
                     break;
                  default:
                     break;
               }
            });
         }

         detailCom.displayData(item);

         const itemWidth =
            $dataview.data.count() > 0
               ? $dataview.type.width
               : ($detailItem.$width - 20) / this.settings.xCount;
         const itemHeight =
            $dataview.data.count() > 0
               ? $dataview.type.height
               : $detailItem.getChildViews?.()?.[0]?.$height;

         const tmpDom = document.createElement("div");
         tmpDom.appendChild($detailItem.$view);

         $detailItem.define("width", itemWidth - 24);
         $detailItem.define("height", itemHeight + 15);
         $detailItem.adjust();

         this.addCyItemAttributes(tmpDom, item);
         const rowId = item?.id ?? item?.uuid ?? "";
         return tmpDom.innerHTML.replace(/#itemId#/g, rowId);
      }

      getItemWidth(baseElement) {
         const $dataview = $$(this.ids.dataview);
         let currElem = baseElement ?? $dataview;
         let parentWidth = currElem?.$width;

         while (currElem) {
            if (currElem.config.view == "scrollview" || currElem.config.view == "layout")
               parentWidth =
                  currElem?.$width < parentWidth ? currElem?.$width : parentWidth;
            currElem = currElem?.getParentView?.();
         }

         if (!parentWidth) {
            parentWidth = $dataview?.getParentView?.().$width || window.innerWidth;
         }
         if (parentWidth > window.innerWidth) parentWidth = window.innerWidth;

         // Browser chrome can reduce available width; subtract sidebar when needed.
         if (window.innerWidth - 19 <= parentWidth) {
            const $sidebar = this.getTabSidebar();
            if ($sidebar) parentWidth -= $sidebar.$width;
         }

         return Math.floor(parentWidth / this.settings.xCount);
      }

      getTabSidebar() {
         const $dataview = $$(this.ids.dataview);
         let $sidebar;
         let currElem = $dataview;
         while (currElem && !$sidebar) {
            $sidebar = (currElem.getChildViews?.() ?? []).filter(
               (item) => item?.config?.view == "sidebar"
            )[0];
            currElem = currElem?.getParentView?.();
         }
         return $sidebar;
      }

      applyClickEvent() {
         const editPage = this.settings.editPage;
         const detailsPage = this.settings.detailsPage;
         if (!detailsPage && !editPage) return;

         const $dataview = $$(this.ids.dataview);
         if (!$dataview) return;

         $dataview.$view.onclick = (e) => {
            let clicked = false;
            let divs = e.path ?? [];

            // Some browsers do not support Event.path.
            if (!divs.length) {
               divs.push(e.target);
               divs.push(e.target.parentNode);
            }

            if (editPage) {
               for (const p of divs) {
                  if (p.className && p.className.indexOf("webix_accordionitem_header") > -1) {
                     clicked = true;
                     p.parentNode.parentNode.classList.forEach((c) => {
                        if (c.indexOf("ab-record-") > -1) {
                           this.linkPage.changePage(editPage, c.replace("ab-record-", ""));
                        }
                     });
                     break;
                  }
               }
            }

            if (detailsPage && !clicked) {
               for (const p of divs) {
                  if (p.className && p.className.indexOf("webix_accordionitem") > -1) {
                     p.parentNode.parentNode.classList.forEach((c) => {
                        if (c.indexOf("ab-record-") > -1) {
                           this.linkPage.changePage(
                              detailsPage,
                              c.replace("ab-record-", "")
                           );
                        }
                     });
                     break;
                  }
               }
            }
         };
      }

      addCyAttribute() {
         const baseView = this.view;
         const $dataview = $$(this.ids.dataview);
         if (!$dataview?.$view) return;
         const name = (baseView.name ?? "").replace(".dataview", "");
         $dataview.$view.setAttribute(
            "data-cy",
            `dataview container ${name} ${baseView.id}`
         );
      }

      addCyItemAttributes(dom, item) {
         const baseView = this.view;
         const uuid = item?.uuid ?? item?.id ?? "";
         const name = (baseView.name ?? "").replace(".dataview", "");
         dom.querySelector(".webix_accordionitem_body")?.setAttribute(
            "data-cy",
            `dataview item ${name} ${uuid} ${baseView.id}`
         );
         dom.querySelector(".webix_accordionitem_button")?.setAttribute(
            "data-cy",
            `dataview item button ${name} ${uuid} ${baseView.id}`
         );
      }

      get detailComponent() {
         return (this._detailComponent =
            this._detailComponent ??
            new DetailComponent(this.view, `${this.ids.component}_detail_view`));
      }

      get linkPageHelper() {
         return (this.__linkPageHelper =
            this.__linkPageHelper || new ABViewPropertyLinkPageLocal());
      }
   };
}
