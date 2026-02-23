import viewForm from "./view_form/FNAbviewform.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";
import viewMenu from "./view_menu/FNAbviewmenu.js";

const AllPlugins = [viewTab, viewList, viewDetail, viewMenu, viewForm];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
