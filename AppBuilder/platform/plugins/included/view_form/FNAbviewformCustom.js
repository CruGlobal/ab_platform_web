import FNAbviewformCustomComponent from "./viewComponent/FNAbviewformCustomComponent.js";
import FNAbviewformCustomCoreFactory from "./core/ABViewFormCustomCore.js";

export default function FNAbviewformCustom({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
   ABFieldImage,
   FocusableTemplate,
}) {
   const ABViewFormCustomCore = FNAbviewformCustomCoreFactory(ABViewFormItem);
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
