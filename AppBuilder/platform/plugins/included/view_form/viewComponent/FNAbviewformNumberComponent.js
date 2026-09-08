export default function FNAbviewformNumberComponent({
   ABViewFormItemComponent,
}) {
   return class ABViewFormNumberComponent extends ABViewFormItemComponent {
      constructor(baseView, idBase, ids) {
         super(baseView, idBase || `ABViewFormNumber_${baseView.id}`, ids);
      }

      ui() {
         const settings = this.view.settings ?? {};
         const _ui = {};

         if (settings.isStepper) {
            _ui.view = "counter";
         } else {
            _ui.view = "text";
            _ui.attributes = { type: "number" };
         }

         return super.ui(_ui);
      }
   };
}
