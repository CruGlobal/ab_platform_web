import ABViewFormCheckboxCore from "../../core/views/ABViewFormCheckboxCore";
import ABViewFormCheckboxComponent from "./viewComponent/ABViewFormCheckboxComponent";

export default class ABViewFormCheckbox extends ABViewFormCheckboxCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormCheckboxComponent(this);
   }
};
