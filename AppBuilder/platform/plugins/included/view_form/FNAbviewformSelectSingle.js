import FNAbviewformSelectSingleComponent from "./viewComponent/FNAbviewformSelectSingleComponent.js";
import FNAbviewformSelectSingleCoreFactory from "./core/ABViewFormSelectSingleCore.js";

export default function FNAbviewformSelectSingle({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
}) {
   const ABViewFormSelectSingleCore =
      FNAbviewformSelectSingleCoreFactory(ABViewFormItem);
   const ABAbviewformSelectSingleComponent = FNAbviewformSelectSingleComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormSelectSingle extends ABViewFormSelectSingleCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformSelectSingleComponent(this);
      }
   };
}
