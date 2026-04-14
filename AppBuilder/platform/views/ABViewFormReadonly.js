import ABViewFormReadonlyCore from "../../core/views/ABViewFormReadonlyCore";
import ABViewFormReadonlyComponent from "./viewComponent/ABViewFormReadonlyComponent";

export default class ABViewFormReadonly extends ABViewFormReadonlyCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormReadonlyComponent(this);
   }
};
