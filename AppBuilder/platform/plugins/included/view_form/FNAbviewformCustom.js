import FNAbviewformCustomComponent from "./viewComponent/FNAbviewformCustomComponent.js";
import FNAbviewformCustomCoreFactory from "./core/ABViewFormCustomCore.js";

export default function FNAbviewformCustom({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
   ABFieldImage,
}) {
   const ABViewFormCustomCore = FNAbviewformCustomCoreFactory(ABViewFormItem);
   const ABAbviewformCustomComponent = FNAbviewformCustomComponent({
      ABViewFormItemComponent,
      ABFieldImage,
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
