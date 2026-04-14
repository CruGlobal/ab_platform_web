import ABViewDetailSelectivityCore from "../../core/views/ABViewDetailSelectivityCore";
import ABViewDetailSelectivityComponent from "./viewComponent/ABViewDetailSelectivityComponent";

export default class ABViewDetailSelectivity extends (
   ABViewDetailSelectivityCore
) {
   /**
    * @component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewDetailSelectivityComponent(this);
   }
};
