import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";
import viewText from "./view_text/FNAbviewtext.js";
import viewImage from "./view_image/FNAbviewimage.js";
import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";

const AllPlugins = [viewTab, viewList, viewDetail, viewText, viewImage, viewDataSelect];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
