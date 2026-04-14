import ABViewFormNumberCore from "../../core/views/ABViewFormNumberCore";
import ABViewFormNumberComponent from "./viewComponent/ABViewFormNumberComponent";

export default class ABViewFormNumber extends ABViewFormNumberCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormNumberComponent(this);
   }
};
