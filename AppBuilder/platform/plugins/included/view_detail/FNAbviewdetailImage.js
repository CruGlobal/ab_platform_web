import FNAbviewdetailImageComponent from "./viewComponent/FNAbviewdetailImageComponent.js";
import FNAbviewdetailImageCoreFactory from "./core/ABViewDetailImageCore.js";

export default function FNAbviewdetailImage({
   ABViewComponentPlugin,
   ABViewDetailItemComponent,
   ABViewDetailItem,
}) {
   const ABViewDetailImageCore =
      FNAbviewdetailImageCoreFactory(ABViewDetailItem);
   const ABViewDetailImageComponent = FNAbviewdetailImageComponent(
      ABViewDetailItemComponent
   );

   return class ABViewDetailImage extends ABViewDetailImageCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      static get Component() {
         return ABViewDetailImageComponent;
      }

      component() {
         return new ABViewDetailImageComponent(this);
      }
   };
}
