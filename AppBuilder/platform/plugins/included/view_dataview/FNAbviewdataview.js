import FNAbviewdataviewComponent from "./FNAbviewdataviewComponent.js";

// Dataview plugin: replaces ABViewDataviewCore + ABViewDataview.
// All runtime logic is kept in this plugin module.
export default function FNAbviewdataview({
   ABViewContainer,
   ABViewContainerComponent,
   ABViewComponentPlugin,
}) {
   const ABAbviewdataviewComponent = FNAbviewdataviewComponent({
      ABViewContainerComponent,
      ABViewComponentPlugin,
   });

   const ABViewDataviewPropertyComponentDefaults = {
      xCount: 1, // Number of columns per row (must be >= 1).
      detailsPage: "",
      detailsTab: "",
      editPage: "",
      editTab: "",
      dataviewID: null,
      showLabel: true,
      labelPosition: "left",
      labelWidth: 120,
      height: 0,
   };

   const ABViewDataviewDefaults = {
      key: "dataview",
      icon: "th",
      labelKey: "Data view(plugin)",
   };

   return class ABViewDataviewPlugin extends ABViewContainer {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues ?? ABViewDataviewDefaults
         );
      }

      static getPluginType() {
         return "view";
      }

      static getPluginKey() {
         return this.common().key;
      }

      static common() {
         return ABViewDataviewDefaults;
      }

      static defaultValues() {
         return ABViewDataviewPropertyComponentDefaults;
      }

      fromValues(values) {
         super.fromValues(values);

         this.settings.xCount = parseInt(
            this.settings.xCount || ABViewDataviewPropertyComponentDefaults.xCount
         );

         this.settings.detailsPage =
            this.settings.detailsPage ??
            ABViewDataviewPropertyComponentDefaults.detailsPage;
         this.settings.editPage =
            this.settings.editPage ??
            ABViewDataviewPropertyComponentDefaults.editPage;
         this.settings.detailsTab =
            this.settings.detailsTab ??
            ABViewDataviewPropertyComponentDefaults.detailsTab;
         this.settings.editTab =
            this.settings.editTab ?? ABViewDataviewPropertyComponentDefaults.editTab;

         this.settings.labelPosition =
            this.settings.labelPosition ||
            ABViewDataviewPropertyComponentDefaults.labelPosition;
         this.settings.showLabel = JSON.parse(
            this.settings.showLabel != null
               ? this.settings.showLabel
               : ABViewDataviewPropertyComponentDefaults.showLabel
         );
         this.settings.labelWidth = parseInt(
            this.settings.labelWidth ||
               ABViewDataviewPropertyComponentDefaults.labelWidth
         );
         this.settings.height = parseInt(
            this.settings.height ??
               ABViewDataviewPropertyComponentDefaults.height
         );
      }

      component(parentId) {
         return new ABAbviewdataviewComponent(this, parentId);
      }

      // Dataview behaves like Detail and allows detail field views.
      componentList() {
         const viewsToAllow = ["label", "text"];
         const allComponents = this.application.viewAll();
         return allComponents.filter((c) =>
            viewsToAllow.includes(c.common().key)
         );
      }

      addFieldToDetail(field, yPosition) {
         if (field == null) return;

         const newView = field.detailComponent().newInstance(this.application, this);
         if (newView == null) return;

         // Keep the same field wiring behavior as Detail so ABDesigner can
         // auto-build field cards after a Data Source is selected.
         newView.settings = newView.settings ?? {};
         newView.settings.fieldId = field.id;
         newView.settings.labelWidth =
            this.settings.labelWidth ||
            ABViewDataviewPropertyComponentDefaults.labelWidth;

         // Preserve alias support for query-based sources: [alias].[columnName].
         newView.settings.alias = field.alias;
         newView.position.y = yPosition;

         this._views.push(newView);
         return newView;
      }

      parentDetailComponent() {
         let dataview = null;
         let curr = this;

         while (curr.key != "dataview" && !curr.isRoot() && curr.parent) {
            curr = curr.parent;
         }

         if (curr.key == "dataview") {
            dataview = curr;
         }

         return dataview;
      }

      warningsEval() {
         super.warningsEval();

         const DC = this.datacollection;
         if (!DC) {
            this.warningsMessage(
               `can't resolve it's datacollection[${this.settings.dataviewID}]`
            );
         }
      }
   };
}
