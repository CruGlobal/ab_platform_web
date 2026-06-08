import FNABViewPivotComponent from "./FNABViewPivotComponent.js";

// FNAbviewpivot Web
// A web side import for an ABView.
//
export default function FNABViewPivot({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewpivotComponent = FNABViewPivotComponent({
      AB,
      ABViewComponentPlugin,
   });

   const ABViewPivotPropertyComponentDefaults = {
      dataviewID: null,
      removeMissed: 0,
      totalColumn: 0,
      separateLabel: 0,
      min: 0,
      max: 0,
      height: 0,
   };

   const ABViewDefaults = {
      key: "pivot", // {string} unique key for this view
      icon: "cube", // {string} fa-[icon] reference for this view
      labelKey: "Pivot", // {string} the multilingual label key for the class label
   };

   class ABViewPivotCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewPivotPropertyComponentDefaults;
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

         // Convert to boolean
         this.settings.removeMissed = JSON.parse(
            this.settings.removeMissed ||
            ABViewPivotPropertyComponentDefaults.removeMissed
         );
         this.settings.totalColumn = JSON.parse(
            this.settings.totalColumn ||
            ABViewPivotPropertyComponentDefaults.totalColumn
         );
         this.settings.separateLabel = JSON.parse(
            this.settings.separateLabel ||
            ABViewPivotPropertyComponentDefaults.separateLabel
         );
         this.settings.min = JSON.parse(
            this.settings.min || ABViewPivotPropertyComponentDefaults.min
         );
         this.settings.max = JSON.parse(
            this.settings.max || ABViewPivotPropertyComponentDefaults.max
         );

         if (
            this.settings.structure &&
            typeof this.settings.structure == "string"
         )
            this.settings.structure = JSON.parse(this.settings.structure);

         // "0" -> 0
         this.settings.height = parseInt(
            this.settings.height || ABViewPivotPropertyComponentDefaults.height
         );
      }

      /**
       * @method toObj()
       *
       * properly compile the current state of this ABViewLabel instance
       * into the values needed for saving.
       *
       * @return {json}
       */
      toObj() {
         var obj = super.toObj();

         obj.views = [];
         obj.settings = obj.settings || {};

         if (this.settings.structure)
            obj.settings.structure = JSON.stringify(this.settings.structure);

         return obj;
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   }

   return class ABViewPivot extends ABViewPivotCore {
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
         return new ABAbviewpivotComponent(this, parentId);
      }

      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues);
      }

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
