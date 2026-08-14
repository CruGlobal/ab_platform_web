import FNAbviewdetail from "../../../../AppBuilder/platform/plugins/included/view_detail/FNAbviewdetail.js";
import FNAbviewdetailItem from "../../../../AppBuilder/platform/plugins/included/view_detail/FNAbviewdetailItem.js";
import FNAbviewdetailCheckboxComponent from "../../../../AppBuilder/platform/plugins/included/view_detail/viewComponent/FNAbviewdetailCheckboxComponent.js";
import FNAbviewdetailConnectComponent from "../../../../AppBuilder/platform/plugins/included/view_detail/viewComponent/FNAbviewdetailConnectComponent.js";
import FNAbviewdetailCustomComponent from "../../../../AppBuilder/platform/plugins/included/view_detail/viewComponent/FNAbviewdetailCustomComponent.js";
import FNAbviewdetailImageComponent from "../../../../AppBuilder/platform/plugins/included/view_detail/viewComponent/FNAbviewdetailImageComponent.js";
import FNAbviewdetailSelectivityComponent from "../../../../AppBuilder/platform/plugins/included/view_detail/viewComponent/FNAbviewdetailSelectivityComponent.js";
import FNAbviewdetailTextComponent from "../../../../AppBuilder/platform/plugins/included/view_detail/viewComponent/FNAbviewdetailTextComponent.js";
import FNAbviewdetailTreeComponent from "../../../../AppBuilder/platform/plugins/included/view_detail/viewComponent/FNAbviewdetailTreeComponent.js";

export function getDetailClasses(AB) {
   const api = AB.ClassManager.getPluginAPI();
   api.AB = AB;

   // Construct DetailAPI to mimic what FNAbviewdetail receives
   const DetailAPI = Object.assign({}, api);
   DetailAPI.ABViewWidget = api.ABViewWidgetPlugin;
   DetailAPI.ABViewDetailItem = FNAbviewdetailItem(DetailAPI);
   DetailAPI.ABViewDetailItemComponent = DetailAPI.ABViewDetailItem.ABViewDetailItemComponent;

   const classes = FNAbviewdetail(DetailAPI);

   const ABViewDetail = classes.find((c) => c.common?.().key === "detail");
   const ABViewDetailCheckbox = classes.find((c) => c.common?.().key === "detailcheckbox");
   const ABViewDetailConnect = classes.find((c) => c.common?.().key === "detailconnect");
   const ABViewDetailCustom = classes.find((c) => c.common?.().key === "detailcustom");
   const ABViewDetailImage = classes.find((c) => c.common?.().key === "detailimage");
   const ABViewDetailSelectivity = classes.find((c) => c.common?.().key === "detailselectivity");
   const ABViewDetailText = classes.find((c) => c.common?.().key === "detailtext");
   const ABViewDetailTree = classes.find((c) => c.common?.().key === "detailtree");

   const ABViewDetailCheckboxComponent = FNAbviewdetailCheckboxComponent(DetailAPI.ABViewDetailItemComponent);
   const ABViewDetailConnectComponent = FNAbviewdetailConnectComponent(DetailAPI.ABViewDetailItemComponent);
   const ABViewDetailCustomComponent = FNAbviewdetailCustomComponent(DetailAPI.ABViewDetailItemComponent);
   const ABViewDetailImageComponent = FNAbviewdetailImageComponent(DetailAPI.ABViewDetailItemComponent);
   const ABViewDetailSelectivityComponent = FNAbviewdetailSelectivityComponent(DetailAPI.ABViewDetailItemComponent);
   const ABViewDetailTextComponent = FNAbviewdetailTextComponent(DetailAPI.ABViewDetailItemComponent);
   const ABViewDetailTreeComponent = FNAbviewdetailTreeComponent(DetailAPI.ABViewDetailItemComponent);

   return {
      ABViewDetail,
      ABViewDetailCheckbox,
      ABViewDetailConnect,
      ABViewDetailCustom,
      ABViewDetailImage,
      ABViewDetailSelectivity,
      ABViewDetailText,
      ABViewDetailTree,
      ABViewDetailItem: DetailAPI.ABViewDetailItem,
      ABViewDetailItemComponent: DetailAPI.ABViewDetailItemComponent,
      ABViewDetailCheckboxComponent,
      ABViewDetailConnectComponent,
      ABViewDetailCustomComponent,
      ABViewDetailImageComponent,
      ABViewDetailSelectivityComponent,
      ABViewDetailTextComponent,
      ABViewDetailTreeComponent,
   };
}
