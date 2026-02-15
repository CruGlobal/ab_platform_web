const ABViewManagerCore = require("../core/ABViewManagerCore");
const ClassManager = require("./ABClassManager");

module.exports = class ABViewManager extends ABViewManagerCore {
   /**
    * @function newView
    * return an instance of an ABView based upon the values.key value.
    * @return {ABView}
    */
   static newView(values, application, parent) {
      parent = parent || null;

      // Moving to ClassManager for our default views:
      let key = values.plugin_key || values.key;
      let view = null;

      try {
         view = ClassManager.viewCreate(key, values, application, parent);
      } catch (error) {
         // console.error(`Error creating view ${key}:`, error);
         view = super.newView(values, application, parent);
      }
      return view;
   }

   static viewClass(key) {
      let viewClass = null;
      console.log(
         "ABViewManager.viewClass() is depreciated.  Use ClassManager.viewClass() instead.",
         key
      );

      try {
         viewClass = ClassManager.viewClass(key);
      } catch (error) {
         viewClass = super.viewClass(key);
      }
      return viewClass;
   }
};
