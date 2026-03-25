import viewCarousel from "./view_carousel/FNAbviewcarousel.js";
import viewComment from "./view_comment/FNAbviewcomment.js";
import viewCsvExporter from "./view_csvExporter/FNAbviewcsvexporter.js";
import viewCsvImporter from "./view_csvImporter/FNAbviewcsvimporter.js";
import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";
import viewImage from "./view_image/FNAbviewimage.js";
import viewLabel from "./view_label/FNAbviewlabel.js";
import viewLayout from "./view_layout/FNAbviewlayout.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewPdfImporter from "./view_pdfImporter/FNAbviewpdfimporter.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewText from "./view_text/FNAbviewtext.js";

const AllPlugins = [
   viewCarousel,
   viewComment,
   viewCsvExporter,
   viewCsvImporter,
   viewCsvImporter,
   viewDataSelect,
   viewDetail,
   viewImage,
   viewLabel,
   viewLayout,
   viewList,
   viewPdfImporter,
   viewTab,
   viewText,
];

export default {
   load: (AB) => {
      AllPlugins.forEach((plugin) => {
         AB.pluginRegister(plugin);
      });
   },
};
