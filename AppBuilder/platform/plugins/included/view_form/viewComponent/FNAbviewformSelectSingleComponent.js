export default function FNAbviewformSelectSingleComponent({
   ABViewFormItemComponent,
}) {
   return class ABViewFormSelectSingleComponent extends ABViewFormItemComponent {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewFormSelectSingle_${baseView.id}`,
            ids
         );
      }

      ui() {
         const baseView = this.view;
         const field = baseView.field(),
            settings = this.settings;
         const options = [];

         if (field?.key === "user") {
            options.push(...field.getUsers());
         } else if (field) {
            options.push(...(field.settings.options ?? settings.options ?? []));
         }

         const _ui = {
            view: settings.type || baseView.constructor.defaultValues().type,
            options: options.map((opt) => {
               return {
                  id: opt.id,
                  value: opt.text ?? opt.value,
                  hex: opt.hex,
               };
            }),
         };

         return super.ui(_ui);
      }
   };
}
