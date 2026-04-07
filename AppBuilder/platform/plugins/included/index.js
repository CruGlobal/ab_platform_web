import viewCarousel from "./view_carousel/FNAbviewcarousel.js";
import viewChart from "./view_chart/chart/FNAbviewchart.js";
import viewChartArea from "./view_chart/area/FNAbviewchartarea.js";
import viewChartBar from "./view_chart/bar/FNAbviewchartbar.js";
import viewChartLine from "./view_chart/line/FNAbviewchartline.js";
import viewChartPie from "./view_chart/pie/FNAbviewchartpie.js";
import viewComment from "./view_comment/FNAbviewcomment.js";
import viewCsvExporter from "./view_csvExporter/FNAbviewcsvexporter.js";
import viewCsvImporter from "./view_csvImporter/FNAbviewcsvimporter.js";
import viewDataSelect from "./view_data-select/FNAbviewdataselect.js";
import viewDataview from "./view_dataview/FNAbviewdataview.js";
import viewDetail from "./view_detail/FNAbviewdetail.js";
import viewGantt from "./view_gantt/FNAbviewgantt.js";
import viewImage from "./view_image/FNAbviewimage.js";
import viewKanban from "./view_kanban/FNABViewKanban.js";
import viewLabel from "./view_label/FNAbviewlabel.js";
import viewLayout from "./view_layout/FNAbviewlayout.js";
import viewList from "./view_list/FNAbviewlist.js";
import viewPdfImporter from "./view_pdfImporter/FNAbviewpdfimporter.js";
import viewPivot from "./view_pivot/FNABViewPivot.js";
import viewPie from "./view_chart/pie/FNAbviewchartpie.js";
import viewTab from "./view_tab/FNAbviewtab.js";
import viewText from "./view_text/FNAbviewtext.js";

const AllPlugins = [
   viewCarousel,
   viewChart,
   viewChartArea,
   viewChartBar,
   viewChartLine,
   viewChartPie,
   viewComment,
   viewCsvExporter,
   viewCsvImporter,
   viewDataSelect,
   viewDataview,
   viewDetail,
   viewGantt,
   viewImage,
   viewKanban,
   viewLabel,
   viewLayout,
   viewList,
   viewPdfImporter,
   viewPivot,
   viewPie,
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
