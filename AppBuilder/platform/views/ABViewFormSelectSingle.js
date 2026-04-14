import ABViewFormSelectSingleCore from "../../core/views/ABViewFormSelectSingleCore";
import ABViewFormSelectSingleComponent from "./viewComponent/ABViewFormSelectSingleComponent";

export default class ABViewFormSelectSingle extends (
   ABViewFormSelectSingleCore
) {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormSelectSingleComponent(this);
   }
};
