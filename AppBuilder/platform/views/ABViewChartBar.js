import ABViewChartBarCore from "../../core/views/ABViewChartBarCore";
import ABViewChartBarComponent from "./viewComponent/ABViewChartBarComponent";

export default class ABViewChartBar extends ABViewChartBarCore {
   // constructor(values, application, parent, defaultValues) {
   //    super(values, application, parent, defaultValues);
   // }

   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewChartBarComponent(this);
   }
};
