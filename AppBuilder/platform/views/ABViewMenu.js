import ABViewMenuCore from "../../core/views/ABViewMenuCore";
import ABViewMenuComponent from "./viewComponent/ABViewMenuComponent";

export default class ABViewMenu extends ABViewMenuCore {
   /**
    * @function component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewMenuComponent(this);
   }
};
