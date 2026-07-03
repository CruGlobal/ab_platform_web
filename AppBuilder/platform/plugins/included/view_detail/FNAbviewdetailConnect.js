import FNAbviewdetailConnectComponent from "./viewComponent/FNAbviewdetailConnectComponent.js";
import FNAbviewdetailConnectCoreFactory from "./core/ABViewDetailConnectCore.js";

export default function FNAbviewdetailConnect({
   ABViewComponentPlugin,
   ABViewDetailItemComponent,
   ABViewDetailItem,
   ABViewPropertyAddPage,
}) {
   const ABViewDetailConnectCore =
      FNAbviewdetailConnectCoreFactory(ABViewDetailItem);
   const ABViewDetailConnectComponent = FNAbviewdetailConnectComponent(
      ABViewDetailItemComponent
   );

   return class ABViewDetailConnect extends ABViewDetailConnectCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      fromValues(values) {
         super.fromValues(values);
         this.addPageTool.fromSettings(this.settings);
      }

      component() {
         return new ABViewDetailConnectComponent(this);
      }

      get addPageTool() {
         if (this.__addPageTool == null)
            this.__addPageTool = new ABViewPropertyAddPage();

         return this.__addPageTool;
      }
   };
}
