import ABViewChartAreaCore from "../../core/views/ABViewChartAreaCore";
import ABViewChartAreaComponent from "./viewComponent/ABViewChartAreaComponent";

export default class ABViewChartArea extends ABViewChartAreaCore {
   // constructor(values, application, parent, defaultValues) {
   //    super(values, application, parent, defaultValues);
   // }

   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewChartAreaComponent(this);
   }
};
