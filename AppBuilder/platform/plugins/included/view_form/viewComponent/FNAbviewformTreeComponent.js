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

         _ui.view = "template";
         _ui.css = "webix_el_box";
         _ui.height =
            field.settings.useHeight === 1
               ? parseInt(field.settings.imageHeight)
               : 38;
         _ui.borderless = true;

         _ui.template = (obj) => {
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
         };

         _ui.onClick = {
            customField: (id, e, trg) => {
               const node = $$(this.ids.formItem).$view;

               field.customEdit(
                  { [field.columnName]: self.getValue() },
                  node,
                  this
               );
            },
         };

         _ui.on = {
            onAfterRender: function () {
               if (this.config.value) {
                  self._value = this.config.value;
               }

               this.setValue = (vals) => {
                  self._value = vals;
                  this.refresh();
               };
               this.getValue = () => {
                  return self._value || "";
               };
               this.setValues = (vals) => {
                  this.setValue(vals);
               };
               this.getValues = () => {
                  return this.getValue();
               };
            },
         };

         return super.ui(_ui);
      }

      getValue(rowData) {
         const $formItem = $$(this.ids.formItem);
         if (!$formItem) return "";

         let vals = $formItem.getValue();

         // Pass empty string if the returned values is empty array
         if (Array.isArray(vals) && vals.length === 0) vals = "";

         return vals;
      }
   };
}
