import FNAbviewdetailComponent from "./FNAbviewdetailComponent.js";

// Detail view plugin: replaces the original ABViewDetail / ABViewDetailCore.
// All logic from both Core and platform is contained in this file.
export default function FNAbviewdetail({
   ABViewContainer,
   ABViewComponentPlugin,
}) {
   const ABViewDetailComponent = FNAbviewdetailComponent({
      ABViewComponentPlugin,
   });

   const ABViewDetailDefaults = {
      key: "detail",
      icon: "file-text-o",
      labelKey: "Detail(plugin)",
   };

   const ABViewDetailPropertyComponentDefaults = {
      dataviewID: null,
      showLabel: true,
      labelPosition: "left",
      labelWidth: 120,
      height: 0,
   };

   return class ABViewDetailPlugin extends ABViewContainer {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABView} parent the ABView this view is a child of. (can be null)
       */
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues ?? ABViewDetailDefaults
         );
      }

      static getPluginType() {
         return "view";
      }

      static getPluginKey() {
         return this.common().key;
      }

      static common() {
         return ABViewDetailDefaults;
      }

      static defaultValues() {
         return ABViewDetailPropertyComponentDefaults;
      }

      /**
       * @method fromValues()
       * Initialize this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         this.settings.labelPosition =
            this.settings.labelPosition ||
            ABViewDetailPropertyComponentDefaults.labelPosition;

         this.settings.showLabel = JSON.parse(
            this.settings.showLabel != null
               ? this.settings.showLabel
               : ABViewDetailPropertyComponentDefaults.showLabel
         );

         this.settings.labelWidth = parseInt(
            this.settings.labelWidth ||
               ABViewDetailPropertyComponentDefaults.labelWidth
         );
         this.settings.height = parseInt(
            this.settings.height ??
               ABViewDetailPropertyComponentDefaults.height
         );
      }

      /**
       * @method componentList
       * Return the list of components available on this view to display in the editor.
       */
      componentList() {
         const viewsToAllow = ["label", "text"];
         const allComponents = this.application.viewAll();
         return allComponents.filter((c) =>
            viewsToAllow.includes(c.common().key)
         );
      }

      addFieldToDetail(field, yPosition) {
         if (field == null) return;

         const newView = field
            .detailComponent()
            .newInstance(this.application, this);
         if (newView == null) return;

         newView.settings = newView.settings ?? {};
         newView.settings.fieldId = field.id;
         newView.settings.labelWidth =
            this.settings.labelWidth ||
            ABViewDetailPropertyComponentDefaults.labelWidth;
         newView.settings.alias = field.alias;
         newView.position.y = yPosition;

         this._views.push(newView);
         return newView;
      }

      /**
       * @method component()
       * Return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABViewDetailComponent(this);
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
