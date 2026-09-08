import FNAbviewformJsonComponent from "./viewComponent/FNAbviewformJsonComponent.js";
import FNAbviewformJsonCoreFactory from "./core/ABViewFormJsonCore.js";

export default function FNAbviewformJson({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
}) {
   const ABViewFormJsonCore = FNAbviewformJsonCoreFactory(ABViewFormItem);
   const ABAbviewformJsonComponent = FNAbviewformJsonComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormJson extends ABViewFormJsonCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformJsonComponent(this);
      }
   };
}
