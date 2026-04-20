import FNAbviewformDatepickerComponent from "./viewComponent/FNAbviewformDatepickerComponent.js";
import FNAbviewformDatepickerCoreFactory from "./core/ABViewFormDatepickerCore.js";

export default function FNAbviewformDatepicker({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
}) {
   const ABViewFormDatepickerCore =
      FNAbviewformDatepickerCoreFactory(ABViewFormItem);
   const ABAbviewformDatepickerComponent = FNAbviewformDatepickerComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormDatepicker extends ABViewFormDatepickerCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformDatepickerComponent(this);
      }
   };
}
