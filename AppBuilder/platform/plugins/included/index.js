import viewImage from "./view_image/FNAbviewimage.js";
import viewText from "./view_text/FNAbviewtext.js";
import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";

const AllPlugins = [viewTab, viewList, viewImage, viewText, viewDataSelect];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
