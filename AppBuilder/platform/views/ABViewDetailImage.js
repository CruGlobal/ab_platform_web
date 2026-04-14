import ABViewDetailImageCore from "../../core/views/ABViewDetailImageCore";
import ABViewDetailImageComponent from "./viewComponent/ABViewDetailImageComponent";

export default class ABViewDetailImage extends ABViewDetailImageCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewDetailImageComponent(this);
   }
};
