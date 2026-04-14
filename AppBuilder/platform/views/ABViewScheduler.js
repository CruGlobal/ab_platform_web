import ABViewSchedulerCore from "../../core/views/ABViewSchedulerCore";
import ABViewSchedulerComponent from "./viewComponent/ABViewSchedulerComponent";

export default class ABViewScheduler extends ABViewSchedulerCore {
   // constructor(values, application, parent, defaultValues) {
   //    super(values, application, parent, defaultValues);
   // }

   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewSchedulerComponent(this);
   }

   warningsEval() {
      super.warningsEval();
   }
};
