import ABViewWidget from "./ABViewWidget";
import ABViewChartContainerComponent from "./viewComponent/ABViewChartContainerComponent";

export default class ABViewChartContainer extends ABViewWidget {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewChartContainerComponent(this);
   }

   get datacollection() {
      return this.parent.datacollection;
   }
};
