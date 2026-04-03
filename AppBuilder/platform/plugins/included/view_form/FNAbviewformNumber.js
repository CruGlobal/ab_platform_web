import FNAbviewformNumberComponent from "./viewComponent/FNAbviewformNumberComponent.js";
import FNAbviewformNumberCoreFactory from "./core/ABViewFormNumberCore.js";

export default function FNAbviewformNumber({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
}) {
   const ABViewFormNumberCore = FNAbviewformNumberCoreFactory(ABViewFormItem);
   const ABAbviewformNumberComponent = FNAbviewformNumberComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormNumber extends ABViewFormNumberCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformNumberComponent(this);
      }
   };
}
