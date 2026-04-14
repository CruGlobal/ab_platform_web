import ABViewFormButtonCore from "../../core/views/ABViewFormButtonCore";
import ABViewFormButtonComponent from "./viewComponent/ABViewFormButtonComponent";

export default class ABViewFormButton extends ABViewFormButtonCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormButtonComponent(this);
   }
};
