import FNAbviewdetailTreeComponent from "./viewComponent/FNAbviewdetailTreeComponent.js";
import FNAbviewdetailTreeCoreFactory from "./core/ABViewDetailTreeCore.js";

export default function FNAbviewdetailTree({
   ABViewComponentPlugin,
   ABViewDetailItemComponent,
   ABViewDetailItem,
}) {
   const ABViewDetailTreeCore = FNAbviewdetailTreeCoreFactory(ABViewDetailItem);
   const ABViewDetailTreeComponent = FNAbviewdetailTreeComponent(
      ABViewDetailItemComponent
   );

   return class ABViewDetailTree extends ABViewDetailTreeCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      component() {
         return new ABViewDetailTreeComponent(this);
      }
   };
}
