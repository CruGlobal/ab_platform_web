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
         return super.ui({
            view: "richselect",
         });
      }
   };
}
