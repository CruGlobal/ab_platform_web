import FNAbviewdetailCustomComponent from "./viewComponent/FNAbviewdetailCustomComponent.js";
import FNAbviewdetailCustomCoreFactory from "./core/ABViewDetailCustomCore.js";

export default function FNAbviewdetailCustom({
   ABViewComponentPlugin,
   ABViewDetailItemComponent,
   ABViewDetailItem,
}) {
   const ABViewDetailCustomCore =
      FNAbviewdetailCustomCoreFactory(ABViewDetailItem);
   const ABViewDetailCustomComponent = FNAbviewdetailCustomComponent(
      ABViewDetailItemComponent
   );

   return class ABViewDetailCustom extends ABViewDetailCustomCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      static get Component() {
         return ABViewDetailCustomComponent;
      }

      component() {
         return new ABViewDetailCustomComponent(this);
      }
   };
}
