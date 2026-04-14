import ABViewChartPieCore from "../../core/views/ABViewChartPieCore";
import ABViewChartPieComponent from "./viewComponent/ABViewChartPieComponent";

export default class ABViewChartPie extends ABViewChartPieCore {
   // constructor(values, application, parent, defaultValues) {
   //    super(values, application, parent, defaultValues);
   // }

   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewChartPieComponent(this);
   }
};
