export default function FNAbviewformCheckboxComponent({
   ABViewFormItemComponent,
}) {
   return class ABViewFormCheckboxComponent extends ABViewFormItemComponent {
      constructor(baseView, idBase, ids) {
         super(baseView, idBase || `ABViewFormCheckbox_${baseView.id}`, ids);
      }

      ui() {
         return super.ui({
            view: "checkbox",
         });
      }
   };
}
