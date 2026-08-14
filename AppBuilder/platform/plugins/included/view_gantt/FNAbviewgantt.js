import FNAbviewganttComponent from "./FNAbviewganttComponent.js";


// FNAbviewgantt Web
// A web side import for an ABView.
//
export default function FNAbviewgantt({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer
}) {
   const ABAbviewganttComponent = FNAbviewganttComponent({ ABViewComponentPlugin });

   const ABViewGanttPropertyComponentDefaults = {
      dataviewID: "",
      // {string}
      // {ABDatacollection.id} of the datacollection that contains the data for
      // the Gantt chart.

      titleFieldID: "",
      // {string}
      // {ABFieldXXX.id} of the field that contains the value of the title
      // ABFieldString, ABFieldLongText

      startDateFieldID: "",
      // {string}
      // {ABFieldDate.id} of the field that contains the start date

      endDateFieldID: "",
      // {string}
      // {ABFieldDate.id} of the field that contains the end date

      durationFieldID: "",
      // {string}
      // {ABFieldNumber.id} of the field that contains the duration

      progressFieldID: "",
      // {string}
      // {ABFieldNumber.id} of the field that marks the progress

      notesFieldID: "",
      // {string}
      // {ABFieldXXX.id} of the field that contains the value of the title
      // ABFieldString, ABFieldLongText
   };

   const ABViewDefaults = {
      key: "gantt", // {string} unique key for this view
      icon: "tasks", // {string} fa-[icon] reference for this view
      labelKey: "Gantt", // {string} the multilingual label key for the class label
   };

   class ABViewGanttCore extends ABViewWidgetPlugin {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABViewWidget} parent the ABViewWidget this view is a child of. (can be null)
       */
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewGanttPropertyComponentDefaults;
      }

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         Object.keys(ABViewGanttPropertyComponentDefaults).forEach((k) => {
            this.settings[k] =
               this.settings[k] || ABViewGanttPropertyComponentDefaults[k];
         });
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   };

   return class ABViewGantt extends ABViewGanttCore {

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
         return new ABAbviewganttComponent(this, parentId);
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
         } else {
            if (!this.settings.startDateFieldID) {
               this.warningsMessage(`doesn't have a start date field set.`);
            } else {
               let field = DC.datasource?.fieldByID(
                  this.settings.startDateFieldID
               );
               if (!field) {
                  this.warningsMessage(
                     `can't lookup field: startDate[${this.settings.startDateFieldID}]`
                  );
               }
            }
         }
      }
   }

}

