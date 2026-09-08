import FNAbviewformTextboxComponent from "./viewComponent/FNAbviewformTextboxComponent.js";
import FNAbviewformTextboxCoreFactory from "./core/ABViewFormTextboxCore.js";

export default function FNAbviewformTextbox({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
}) {
   const ABViewFormTextboxCore = FNAbviewformTextboxCoreFactory(ABViewFormItem);
   const ABAbviewformTextboxComponent = FNAbviewformTextboxComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormTextbox extends ABViewFormTextboxCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformTextboxComponent(this);
      }
   };
}
