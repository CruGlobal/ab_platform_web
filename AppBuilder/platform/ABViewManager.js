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

      // check to see if this is a plugin view
      if (values.plugin_key) {
         // If this is from a plugin, create it from ClassManager
         return ClassManager.viewCreate(
            values.plugin_key,
            values,
            application,
            parent
         );
      }

      return super.newView(values, application, parent);
   }
};
