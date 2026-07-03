import FNAbviewdetailCheckboxComponent from "./viewComponent/FNAbviewdetailCheckboxComponent.js";
import FNAbviewdetailCheckboxCoreFactory from "./core/ABViewDetailCheckboxCore.js";

export default function FNAbviewdetailCheckbox({
   ABViewComponentPlugin,
   ABViewDetailItemComponent,
   ABViewDetailItem,
}) {
   const ABViewDetailCheckboxCore =
      FNAbviewdetailCheckboxCoreFactory(ABViewDetailItem);
   const ABViewDetailCheckboxComponent = FNAbviewdetailCheckboxComponent(
      ABViewDetailItemComponent
   );

   return class ABViewDetailCheckbox extends ABViewDetailCheckboxCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      component() {
         return new ABViewDetailCheckboxComponent(this);
      }
   };
}
