import viewImage from "./view_image/FNAbviewimage.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";

const AllPlugins = [viewTab, viewList, viewImage];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
