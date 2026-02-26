import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewText from "./view_text/FNAbviewtext.js";
import viewImage from "./view_image/FNAbviewimage.js";
import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";
import viewPdfImporter from "./view_pdfImporter/FNAbviewpdfimporter.js";
import viewCarousel from "./view_carousel/FNAbviewcarousel.js";

const AllPlugins = [
   viewTab,
   viewList,
   viewText,
   viewImage,
   viewDataSelect,
   viewPdfImporter,
   viewCarousel,
];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
