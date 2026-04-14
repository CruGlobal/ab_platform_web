import ABViewTextCore from "../../core/views/ABViewTextCore";
import ABViewTextComponent from "./viewComponent/ABViewTextComponent";

export default class ABViewText extends ABViewTextCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component(parentId) {
      return new ABViewTextComponent(this, parentId);
   }
};
