import ABViewFormDatepickerCore from "../../core/views/ABViewFormDatepickerCore";
import ABViewFormDatepickerComponent from "./viewComponent/ABViewFormDatepickerComponent";

export default class ABViewFormDatepicker extends ABViewFormDatepickerCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewFormDatepickerComponent(this);
   }
};
