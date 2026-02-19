import viewImage from "./view_image/FNAbviewimage.js";
import viewText from "./view_text/FNAbviewtext.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewLabel from "./view_label/FNAbviewlabel.js";

const AllPlugins = [viewTab, viewList, viewLabel, viewImage, viewText];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
