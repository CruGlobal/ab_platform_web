import ABViewFormSelectMultipleCore from "../../core/views/ABViewFormSelectMultipleCore";
import ABViewFormSelectMultipleComponent from "./viewComponent/ABViewFormSelectMultipleComponent";

export default class ABViewFormSelectMultiple extends (
   ABViewFormSelectMultipleCore
) {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormSelectMultipleComponent(this);
   }
};
