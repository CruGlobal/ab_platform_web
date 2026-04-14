import ABViewDetailCustomCore from "../../core/views/ABViewDetailCustomCore";
import ABViewDetailCustomComponent from "./viewComponent/ABViewDetailCustomComponent";

export default class ABViewDetailCustom extends ABViewDetailCustomCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewDetailCustomComponent(this);
   }
};
