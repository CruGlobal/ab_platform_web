import ABViewFormCustomCore from "../../core/views/ABViewFormCustomCore";
import ABViewFormCustomComponent from "./viewComponent/ABViewFormCustomComponent";

export default class ABViewFormCustom extends ABViewFormCustomCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormCustomComponent(this);
   }
};
