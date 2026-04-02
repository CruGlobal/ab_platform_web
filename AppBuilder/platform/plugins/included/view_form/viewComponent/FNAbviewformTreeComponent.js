import FNAbviewformCustomComponent from "./FNAbviewformCustomComponent.js";

export default function FNAbviewformTreeComponent({
   ABViewFormItemComponent,
   ABFieldImage,
   FocusableTemplate,
}) {
   const ABAbviewformCustomComponent = FNAbviewformCustomComponent({
      ABViewFormItemComponent,
      ABFieldImage,
      FocusableTemplate,
   });

   return class ABViewFormTreeComponent extends ABAbviewformCustomComponent {
      constructor(baseView, idBase, ids) {
         super(baseView, idBase || `ABViewFormTree_${baseView.id}`, ids);
      }
   };
}
