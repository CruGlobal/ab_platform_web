import FNAbviewlistComponent from "./FNAbviewlistComponent.js";

// FNAbviewlist Web
// A web side import for an ABView.
//
export default function FNAbviewlist({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewlistComponent = FNAbviewlistComponent({
      ABViewComponentPlugin,
   });

   const ABViewListPropertyComponentDefaults = {
      dataviewID: null,
      field: null,
      height: 0,
   };

   const ABViewDefaults = {
      key: "list", // {string} unique key for this view
      icon: "list-ul", // {string} fa-[icon] reference for this view
      labelKey: "List(plugin)", // {string} the multilingual label key for the class label
   };

   class ABViewListCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewListPropertyComponentDefaults;
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }

      field() {
         var dv = this.datacollection;
         if (!dv) return null;

         var object = dv.datasource;
         if (!object) return null;

         return object.fieldByID(this.settings.field);
      }
   }

   return class ABViewList extends ABViewListCore {
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
         return new ABAbviewlistComponent(this, parentId);
      }

      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }

      warningsEval() {
         super.warningsEval();
         let DC = this.datacollection;
         if (!DC) {
            this.warningsMessage(
               `can't resolve it's datacollection[${this.settings.dataviewID}]`
            );
         }
      }
   };
}
