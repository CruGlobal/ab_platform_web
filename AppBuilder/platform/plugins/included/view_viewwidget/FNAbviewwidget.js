// FNAbviewwidget Web
// A web side import for an ABViewWidget.
//
export default function FNAbviewwidget({
   /*AB,*/
   ABViewPlugin,
}) {
   const ABViewDefaults = {
      key: "viewwidget", // {string} unique key for this view
      icon: "circle-o-notch ", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.widget", // {string} the multilingual label key for the class label
   };

   const ABPropertyComponentDefaults = {
      columnSpan: 1,
      rowSpan: 1,
   };

   class ABViewWidgetCore extends ABViewPlugin {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABView} parent the ABView this view is a child of. (can be null)
       * @param {obj} defaultValues special sub class defined default values.
       */
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABPropertyComponentDefaults;
      }

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         // convert from "0" => 0
         this.settings.columnSpan = parseInt(
            this.settings.columnSpan || ABPropertyComponentDefaults.columnSpan,
         );
         this.settings.rowSpan = parseInt(
            this.settings.rowSpan || ABPropertyComponentDefaults.rowSpan,
         );
      }
   }

   // const ABPropertyComponentDefaults = ABViewWidgetCore.defaultValues();

   //

   return class ABViewWidget extends ABViewWidgetCore {
      /**
       * @method getPluginKey
       * return the plugin key for this view.
       * @return {string} plugin key
       */
      static getPluginKey() {
         return this.common().key;
      }

      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      // component(parentId) {
      //    return new ABAbviewwidgetComponent(this, parentId);
      // }

      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }
   };
}
