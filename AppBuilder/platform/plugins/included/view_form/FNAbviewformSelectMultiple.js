import FNAbviewformSelectMultipleComponent from "./viewComponent/FNAbviewformSelectMultipleComponent.js";
import FNAbviewformSelectMultipleCoreFactory from "./core/ABViewFormSelectMultipleCore.js";

export default function FNAbviewformSelectMultiple({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormItem,
}) {
   const ABViewFormSelectMultipleCore = FNAbviewformSelectMultipleCoreFactory(ABViewFormItem);

   const ABAbviewformSelectMultipleComponent =
      FNAbviewformSelectMultipleComponent({
         ABViewFormItemComponent,
      });

   return class ABViewFormSelectMultiple extends ABViewFormSelectMultipleCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformSelectMultipleComponent(this);
      }
   };
}
