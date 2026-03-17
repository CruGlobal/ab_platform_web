import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewLabel from "./view_label/FNAbviewlabel.js";

import viewText from "./view_text/FNAbviewtext.js";
import viewImage from "./view_image/FNAbviewimage.js";
import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";
import viewPdfImporter from "./view_pdfImporter/FNAbviewpdfimporter.js";
import viewCarousel from "./view_carousel/FNAbviewcarousel.js";
import viewLayout from "./view_layout/FNAbviewlayout.js";
import viewComment from "./view_comment/FNAbviewcomment.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";

const AllPlugins = [
   viewTab,
   viewList,
   viewText,
   viewLabel,
   viewImage,
   viewDataSelect,
   viewPdfImporter,
   viewCarousel,
   viewLayout,
   viewComment,
   viewDetail,
];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
