import FNAbviewdataselectComponent from "./FNAbviewdataselectComponent.js";

// FNAbviewdataselect Web
// A web side import for an ABView.
//
export default function FNAbviewdataselect({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewdataselectComponent = FNAbviewdataselectComponent({
      ABViewComponentPlugin,
   });

   const ABViewDataSelectPropertyComponentDefaults = {
      dataviewID: null, // uuid of ABDatacollection
   };

   const ABViewDefaults = {
      key: "data-select", // {string} unique key for this view
      icon: "chevron-circle-down", // {string} fa-[icon] reference for this view
      labelKey: "Data Select", // {string} the multilingual label key for the class label
   };

   class ABViewDataSelectCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues ?? ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewDataSelectPropertyComponentDefaults;
      }

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
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   }

   return class ABViewDataSelect extends ABViewDataSelectCore {
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
      component(parentId) {
         return new ABAbviewdataselectComponent(this, parentId);
      }

      warningsEval() {
         super.warningsEval();

         let DC = this.datacollection;
         if (!DC) {
            this.warningsMessage(
               `can't resolve it's datacollection[${this.settings.dataviewID}]`
            );
         } else {
            if (this.settings.viewType == "connected") {
               const object = DC.datasource;
               const [field] = object.fields(
                  (f) => f.columnName === this.settings.field
               );
               if (!field) {
                  this.warningsMessage(`can't resolve field reference`);
               }
            }
         }
      }
   };
}
