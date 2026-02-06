import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";

const AllPlugins = [viewTab, viewList, viewDetail];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
