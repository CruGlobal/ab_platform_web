import FNAbviewformCustomComponent from "./viewComponent/FNAbviewformCustomComponent.js";

export default function FNAbviewformCustom({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormCustomCore,
   ABFieldImage,
   FocusableTemplate,
}) {
   const ABAbviewformCustomComponent = FNAbviewformCustomComponent({
      ABViewFormItemComponent,
      ABFieldImage,
      FocusableTemplate,
   });

   return class ABViewFormCustom extends ABViewFormCustomCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformCustomComponent(this);
      }
   };
}
