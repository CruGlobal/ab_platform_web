import FNAbviewdetailSelectivityComponent from "./viewComponent/FNAbviewdetailSelectivityComponent.js";
import FNAbviewdetailSelectivityCoreFactory from "./core/ABViewDetailSelectivityCore.js";

export default function FNAbviewdetailSelectivity({
   ABViewComponentPlugin,
   ABViewDetailItemComponent,
   ABViewDetailItem,
}) {
   const ABViewDetailSelectivityCore =
      FNAbviewdetailSelectivityCoreFactory(ABViewDetailItem);
   const ABViewDetailSelectivityComponent = FNAbviewdetailSelectivityComponent(
      ABViewDetailItemComponent
   );

   return class ABViewDetailSelectivity extends ABViewDetailSelectivityCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      component() {
         return new ABViewDetailSelectivityComponent(this);
      }
   };
}
