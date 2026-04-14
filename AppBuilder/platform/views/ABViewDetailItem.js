import ABViewDetailItemCore from "../../core/views/ABViewDetailItemCore";
import ABViewDetailItemComponent from "./viewComponent/ABViewDetailItemComponent";

export default class ABViewDetailItem extends ABViewDetailItemCore {
   // constructor(values, application, parent, defaultValues) {
   //    super(values, application, parent, defaultValues);
   // }

   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewDetailItemComponent(this);
   }
};
