import FNAbviewdetailItemComponent from "./viewComponent/FNAbviewdetailItemComponent.js";
import FNAbviewdetailItemCoreFactory from "./core/ABViewDetailItemCore.js";

export default function FNAbviewdetailItem({
   ABViewComponentPlugin,
   ABViewWidget,
}) {
   const ABViewDetailItemCore = FNAbviewdetailItemCoreFactory(ABViewWidget);
   const ABViewDetailItemComponent = FNAbviewdetailItemComponent(
      ABViewComponentPlugin
   );

   const ABViewDetailItem = class ABViewDetailItem extends ABViewDetailItemCore {
      static get Component() {
         return ABViewDetailItemComponent;
      }

      component() {
         return new ABViewDetailItemComponent(this);
      }
   };

   // Attach the component class so subclasses can access it
   ABViewDetailItem.ABViewDetailItemComponent = ABViewDetailItemComponent;

   return ABViewDetailItem;
}
