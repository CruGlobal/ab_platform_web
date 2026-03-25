import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";
import viewCarousel from "./view_carousel/FNAbviewcarousel.js";
import viewComment from "./view_comment/FNAbviewcomment.js";
import viewCsvImporter from "./view_csvImporter/FNAbviewcsvimporter.js";
import viewCsvExporter from "./view_csvExporter/FNAbviewcsvexporter.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";
import viewLabel from "./view_label/FNAbviewlabel.js";
import viewText from "./view_text/FNAbviewtext.js";
import viewImage from "./view_image/FNAbviewimage.js";
import viewPdfImporter from "./view_pdfImporter/FNAbviewpdfimporter.js";
import viewLayout from "./view_layout/FNAbviewlayout.js";

const AllPlugins = [
   viewDetail,
   viewCsvExporter,
   viewCsvImporter,
   viewTab,
   viewList,
   viewDetail,
   viewText,
   viewLabel,
   viewImage,
   viewDataSelect,
   viewPdfImporter,
   viewCarousel,
   viewLayout,
   viewCsvImporter,
   viewComment,
];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
