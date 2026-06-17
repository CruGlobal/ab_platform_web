export default function FNAbviewformTreeComponent({ ABViewFormItemComponent }) {
   return class ABViewFormTreeComponent extends ABViewFormItemComponent {
      constructor(baseView, idBase, ids) {
         super(baseView, idBase || `ABViewFormTree_${baseView.id}`, ids);
      }

      ui() {
         const self = this;
         const baseView = this.view;
         const field = baseView.field();

         const _ui = {
            label: "",
            labelWidth: 0,
         };

         // this field may be deleted
         if (!field) return super.ui(_ui);

         const form = baseView.parentFormComponent();
         const formSettings = form ? form.settings || {} : {};

         const requiredClass =
            field.settings.required === 1 ? "webix_required" : "";

         let templateLabel = "";

         if (formSettings.showLabel) {
            if (formSettings.labelPosition === "top")
               templateLabel = `<label style="display:block; text-align: left; margin: 0; padding:1px 7.5px 0 3px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" class="webix_inp_top_label ${requiredClass}">${field.label}</label>`;
            else
               templateLabel = `<label style="width: ${formSettings.labelWidth}px; display: inline-block; line-height: 32px; float: left; margin: 0; padding:1px 7.5px 0 3px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" class="${requiredClass}">${field.label}</label>`;
         }

         let newWidth = formSettings.labelWidth;

         if (baseView.settings && baseView.settings.formView) newWidth += 40;

         _ui.view = "forminput";
         _ui.labelWidth = 0;
         _ui.paddingY = 0;
         _ui.paddingX = 0;
         _ui.css = "ab-custom-field";
         _ui.body = {
            view: "focusabletemplate",
            css: "customFieldCls",
            borderless: true,
            template: (obj) => {
               let val = self._value || "";

               if (typeof val == "string" && val.indexOf("[") === 0) {
                  try {
                     val = JSON.parse(val);
                  } catch (e) {
                     /* ignore */
                  }
               }

               const rowData = { [field.columnName]: val };
               const template = field
                  .columnHeader({
                     width: newWidth,
                  })
                  .template(rowData);

               return `<div class="customField">${templateLabel}${template}</div>`;
            },
            height:
               field.settings.useHeight === 1
                  ? parseInt(field.settings.imageHeight)
                  : 38,
            onClick: {
               customField: (id, e, trg) => {
                  const node = $$(this.ids.formItem).$view;

                  field.customEdit(
                     { [field.columnName]: self.getValue() },
                     node,
                     this
                  );
               },
            },
         };

         _ui.on = {
            onAfterRender: function () {
               if (this.config.value) {
                  self._value = this.config.value;
               }
            },
         };

         return super.ui(_ui);
      }

      init(AB) {
         this.AB = AB;

         const $formItem = $$(this.ids.formItem);
         if ($formItem) {
            $formItem.setValue = (vals) => {
               let cleanVals = vals;
               if (typeof cleanVals === "string") {
                  if (cleanVals === "") {
                     cleanVals = "";
                  } else if (cleanVals.indexOf("[") === 0) {
                     try {
                        cleanVals = JSON.parse(cleanVals);
                      } catch (e) {
                        cleanVals = cleanVals.split(",").filter((v) => v !== "");
                     }
                  } else {
                     cleanVals = cleanVals.split(",").filter((v) => v !== "");
                  }
               }
               
               if (cleanVals == null) {
                  cleanVals = "";
               } else if (cleanVals !== "" && !Array.isArray(cleanVals)) {
                  cleanVals = [cleanVals];
               }

               this._value = cleanVals;
               if (typeof $formItem.refresh === "function") {
                  $formItem.refresh();
               } else if (typeof $formItem.getBody === "function" && typeof $formItem.getBody().refresh === "function") {
                  $formItem.getBody().refresh();
               }
            };
            $formItem.getValue = () => {
               return this._value || "";
            };
            $formItem.setValues = (vals) => {
               $formItem.setValue(vals);
            };
            $formItem.getValues = () => {
               return $formItem.getValue();
            };
         }

         return super.init(AB);
      }

      getValue(rowData) {
         const $formItem = $$(this.ids.formItem);
         if (!$formItem) return "";

         let vals = $formItem.getValue();

         // Pass empty string if the returned values is empty array
         if (Array.isArray(vals) && vals.length === 0) vals = "";

         return vals || "";
      }
   };
}
