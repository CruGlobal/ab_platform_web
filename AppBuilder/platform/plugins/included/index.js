import viewComment from "./view_comment/FNAbviewcomment.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewLabel from "./view_label/FNAbviewlabel.js";

import viewText from "./view_text/FNAbviewtext.js";
import viewImage from "./view_image/FNAbviewimage.js";
import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";
import viewPdfImporter from "./view_pdfImporter/FNAbviewpdfimporter.js";

const AllPlugins = [
   viewTab,
   viewList,
   viewText,
   viewLabel,
   viewImage,
   viewDataSelect,
   viewPdfImporter,
   viewComment,
];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
