import FNAbviewformTreeComponent from "./viewComponent/FNAbviewformTreeComponent.js";

export default function FNAbviewformTree({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormTreeCore,
   ABFieldImage,
   FocusableTemplate,
}) {
   const ABAbviewformTreeComponent = FNAbviewformTreeComponent({
      ABViewFormItemComponent,
      ABFieldImage,
      FocusableTemplate,
   });

   return class ABViewFormTree extends ABViewFormTreeCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformTreeComponent(this);
      }
   };
}
