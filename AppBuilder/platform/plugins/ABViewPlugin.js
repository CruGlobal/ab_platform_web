import ABView from "../views/ABView.js";

export default class ABViewPlugin extends ABView {
   constructor(...params) {
      super(...params);
   }

   static getPluginKey() {
      return "ab-view-plugin";
   }

   static getPluginType() {
      return "view";
   }

   toObj() {
      const result = super.toObj();
      result.plugin_key = this.constructor.getPluginKey();
      // plugin_key : is what tells our ABFactory.objectNew() to create this object from the plugin class.
      return result;
   }

   static newInstance(application, parent) {
      // return a new instance from ABViewManager:
      return application.viewNew(
         { key: this.common().key, plugin_key: this.getPluginKey() },
         application,
         parent
      );
   }
}
