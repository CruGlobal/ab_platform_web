import ABViewDetailCheckboxCore from "../../core/views/ABViewDetailCheckboxCore";
import ABViewDetailCheckboxComponent from "./viewComponent/ABViewDetailCheckboxComponent";

export default class ABViewDetailCheckbox extends ABViewDetailCheckboxCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewDetailCheckboxComponent(this);
   }
};
