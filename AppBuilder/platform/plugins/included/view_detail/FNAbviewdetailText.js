import FNAbviewdetailTextComponent from "./viewComponent/FNAbviewdetailTextComponent.js";
import FNAbviewdetailTextCoreFactory from "./core/ABViewDetailTextCore.js";

export default function FNAbviewdetailText({
   ABViewComponentPlugin,
   ABViewDetailItemComponent,
   ABViewDetailItem,
}) {
   const ABViewDetailTextCore = FNAbviewdetailTextCoreFactory(ABViewDetailItem);
   const ABViewDetailTextComponent = FNAbviewdetailTextComponent(
      ABViewDetailItemComponent
   );

   return class ABViewDetailText extends ABViewDetailTextCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      component() {
         return new ABViewDetailTextComponent(this);
      }
   };
}
