import viewChart from "./chart/FNAbviewchart.js";
import viewChartArea from "./area/FNAbviewchartarea.js";
import viewChartBar from "./bar/FNAbviewchartbar.js";
import viewChartLine from "./line/FNAbviewchartline.js";
import viewChartPie from "./pie/FNAbviewchartpie.js";

export default function ABchart(API) {
   return [
      viewChart(API),
      viewChartArea(API),
      viewChartBar(API),
      viewChartLine(API),
      viewChartPie(API),
   ];
}