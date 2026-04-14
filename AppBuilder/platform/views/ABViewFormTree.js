import ABViewFormTreeCore from "../../core/views/ABViewFormTreeCore";
import ABViewFormTreeComponent from "./viewComponent/ABViewFormTreeComponent";

export default class ABViewFormTree extends ABViewFormTreeCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @param {obj} App
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormTreeComponent(this);
   }
};
