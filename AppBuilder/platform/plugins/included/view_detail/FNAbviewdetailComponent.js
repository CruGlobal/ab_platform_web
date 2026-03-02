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

            const vComponent = f.component(this.idBase);
            vComponent?.setValue?.(val);
            vComponent?.displayText?.(rowData);
         });
      }
   };
}
