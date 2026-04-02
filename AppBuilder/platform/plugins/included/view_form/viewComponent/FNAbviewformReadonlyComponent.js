import FNAbviewformCustomComponent from "./FNAbviewformCustomComponent.js";

export default function FNAbviewformReadonlyComponent({
   ABViewFormItemComponent,
   ABFieldImage,
   FocusableTemplate,
}) {
   const ABAbviewformCustomComponent = FNAbviewformCustomComponent({
      ABViewFormItemComponent,
      ABFieldImage,
      FocusableTemplate,
   });

   return class ABViewFormReadonlyComponent extends ABAbviewformCustomComponent {
      constructor(baseView, idBase, ids) {
         super(baseView, idBase || `ABViewFormReadonly_${baseView.id}`, ids);
      }
   };
}
