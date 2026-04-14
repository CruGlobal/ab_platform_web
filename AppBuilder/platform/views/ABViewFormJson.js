import ABViewFormJsonCore from "../../core/views/ABViewFormJsonCore";
import ABViewFormJsonComponent from "./viewComponent/ABViewFormJsonComponent";

export default class ABViewFormJson extends ABViewFormJsonCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormJsonComponent(this);
   }
};
