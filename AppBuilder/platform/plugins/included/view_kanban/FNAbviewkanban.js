import FNAbviewkanbanComponent from "./FNAbviewkanbanComponent.js";
import FNAbviewKanbanDetachedFormSave from "./FNAbviewKanbanForm.js";
import FNAbviewKanbanFormSidePanel from "./FNAbviewkanbanFormSidePanel.js";

// FNAbviewkanban Web
// A web side import for an ABView.
//
export default function FNAbviewkanban({
   AB,
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewPropertyLinkPage,
   ABViewPlugin,
}) {
   const ABViewKanbanDetachedFormSave = FNAbviewKanbanDetachedFormSave({
      AB,
      ABViewPlugin,
      ABViewComponentPlugin,
   });
   const KanbanFormSidePanel = FNAbviewKanbanFormSidePanel({
      ABViewComponentPlugin,
      ABViewKanbanDetachedFormSave,
   });
   const ABAbviewkanbanComponent = FNAbviewkanbanComponent({
      AB,
      ABViewComponentPlugin,
      FNAbviewKanbanFormSidePanel: KanbanFormSidePanel,
   });

   const ABViewKanbanPropertyComponentDefaults = {
      dataviewID: null, // uuid ABDataCollection; DC resolves ABObject
      editFields: [], // ABField.id[] fields shown in editor
      verticalGroupingField: "", // ABField.id vertical lanes
      horizontalGroupingField: "", // ABField.id optional horizontal grouping
      ownerField: "", // ABFieldUser.id card owner
      template: "", // json ABViewText card body; placeholders {field.id}
   };

   const ABViewDefaults = {
      key: "kanban", // {string} unique view key
      icon: "columns", // {string} font-awesome (no fa- prefix)
      labelKey: "Kanban", // {string} multilingual label key → L(labelKey)
   };

   class ABViewKanbanCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      ///
      /// Instance Methods
      ///

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }

      fromValues(values) {
         super.fromValues(values);

         // set a default .template value
         if (!this.settings.template) {
            this.settings.template = { id: `${this.id}_template`, key: "text" };
            this.settings.template.text = this.settings.textTemplate;
         }

         this.TextTemplate = AB.viewNewDetatched(this.settings.template);
      }

      toObj() {
         var obj = super.toObj();
         obj.settings.template = this.TextTemplate.toObj();
         // NOTE: this corrects the initial save where this.id == undefined
         // all the rest will set the .id correctly.
         obj.settings.template.id = `${this.id}_template`;
         return obj;
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewKanbanPropertyComponentDefaults;
      }
   }

   return class ABViewKanban extends ABViewKanbanCore {
      /**
       * @method getPluginKey
       * return the plugin key for this view.
       * @return {string} plugin key
       */
      static getPluginKey() {
         return this.common().key;
      }
      get linkPageHelper() {
         if (this.__linkPageHelper == null)
            this.__linkPageHelper = new ABViewPropertyLinkPage();

         return this.__linkPageHelper;
      }

      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component(parentId) {
         return new ABAbviewkanbanComponent(this, parentId);
      }

      //
      //	Editor Related
      //

      get linkPageHelper() {
         return (this.__linkPageHelper =
            this.__linkPageHelper || new ABViewPropertyLinkPage());
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
