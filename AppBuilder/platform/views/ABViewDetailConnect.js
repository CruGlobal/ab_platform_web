import ABViewDetailConnectCore from "../../core/views/ABViewDetailConnectCore";
import ABViewPropertyAddPage from "./viewProperties/ABViewPropertyAddPage";
import ABViewDetailConnectComponent from "./viewComponent/ABViewDetailConnectComponent";

export default class ABViewDetailConnect extends ABViewDetailConnectCore {
   ///
   /// Instance Methods
   ///

   /**
    * @method fromValues()
    *
    * initialze this object with the given set of values.
    * @param {obj} values
    */
   fromValues(values) {
      super.fromValues(values);
      this.addPageTool.fromSettings(this.settings);
   }

   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewDetailConnectComponent(this);
   }

   get addPageTool() {
      if (this.__addPageTool == null)
         this.__addPageTool = new ABViewPropertyAddPage();

      return this.__addPageTool;
   }
};
