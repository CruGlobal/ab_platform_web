export default function FNAbviewdetailComponent({ ABViewContainerComponent }) {
   const ContainerComponent =
      ABViewContainerComponent?.default ?? ABViewContainerComponent;
   if (!ContainerComponent) {
      throw new Error(
         "FNAbviewdetailComponent requires ABViewContainerComponent from getPluginAPI()"
      );
   }

   return class ABAbviewdetailComponent extends ContainerComponent {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewDetail_${baseView.id}`,
            Object.assign({ detail: "" }, ids)
         );
         this.idBase = idBase || `ABViewDetail_${baseView.id}`;
      }

      ui() {
         const _ui = super.ui();
         return {
            type: "form",
            id: this.ids.component,
            borderless: true,
            rows: [{ body: _ui }],
         };
      }

      onShow() {
         const baseView = this.view;
         const dataCy = `Detail ${baseView.name?.split(".")[0]} ${baseView.id}`;
         $$(this.ids.component)?.$view?.setAttribute("data-cy", dataCy);

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

         super.onShow();
      }

      displayData(rowData = {}) {
         if (rowData == null) {
            rowData = this.datacollection.getCursor();
         }

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
                        field.settings.options.forEach((options) => {
                           if (options.id === val) myVal = options.text;
                        });
                        if (field.settings.hasColors) {
                           let myHex = "#66666";
                           let hasCustomColor = "";
                           field.settings.options.forEach((h) => {
                              if (h.text === myVal) {
                                 myHex = h.hex;
                                 hasCustomColor = "hascustomcolor";
                              }
                           });
                           myVal = `<span class="webix_multicombo_value ${hasCustomColor}" style="background-color: ${myHex} !important;"><span>${myVal}</span></span>`;
                        }
                        val = myVal;
                     } else {
                        const items = [];
                        val.forEach((value) => {
                           let hasCustomColor = "";
                           let optionHex = "";
                           if (field.settings.hasColors && value.hex) {
                              hasCustomColor = "hascustomcolor";
                              optionHex = `background: ${value.hex};`;
                           }
                           let myVal = "";
                           field.settings.options.forEach((options) => {
                              if (options.id === value.id) myVal = options.text;
                           });
                           items.push(
                              `<span class="webix_multicombo_value ${hasCustomColor}" style="${optionHex}" optvalue="${value.id}"><span>${myVal}</span></span>`
                           );
                        });
                        val = items.join("");
                     }
                     break;
                  case "user":
                     val = field.pullRelationValues(rowData);
                     break;
                  case "file":
                     val = rowData?.[field.columnName];
                     if (!val) {
                        val = "";
                        break;
                     }
                     break;
                  case "formula":
                     if (rowData) {
                        val = field.format(rowData, false);
                     }
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
