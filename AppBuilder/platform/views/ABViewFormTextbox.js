import ABViewFormTextboxCore from "../../core/views/ABViewFormTextboxCore";
import ABViewFormTextboxComponent from "./viewComponent/ABViewFormTextboxComponent";

export default class ABViewFormTextbox extends ABViewFormTextboxCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormTextboxComponent(this);
   }
};
