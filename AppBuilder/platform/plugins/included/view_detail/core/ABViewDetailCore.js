export default function (ABViewContainer) {
   const ABViewDetailDefaults = {
      key: "detail", // {string} unique key for this view
      icon: "file-text-o", // {string} fa-[icon] reference for this view
      labelKey: "Detail", // {string} the multilingual label key for the class label
   };

   const ABViewDetailPropertyComponentDefaults = {
      dataviewID: null,
      showLabel: true,
      labelPosition: "left",
      labelWidth: 120,
      height: 0,
   };

   return class ABViewDetailCore extends ABViewContainer {
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

      static common() {
         return ABViewDetailDefaults;
      }

      static defaultValues() {
         return ABViewDetailPropertyComponentDefaults;
      }

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         this.settings.labelPosition =
            this.settings.labelPosition ||
            ABViewDetailPropertyComponentDefaults.labelPosition;

         // convert from "0" => true/false
         this.settings.showLabel = JSON.parse(
            this.settings.showLabel != null
               ? this.settings.showLabel
               : ABViewDetailPropertyComponentDefaults.showLabel
         );

         // convert from "0" => 0
         this.settings.labelWidth = parseInt(
            this.settings.labelWidth ||
               ABViewDetailPropertyComponentDefaults.labelWidth
         );
         this.settings.height = parseInt(
            this.settings.height ?? ABViewDetailPropertyComponentDefaults.height
         );
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         let viewsToAllow = ["label", "text"],
            allComponents = this.application.viewAll();

         return allComponents.filter((c) => {
            return viewsToAllow.indexOf(c.common().key) > -1;
         });
      }

      addFieldToDetail(field, yPosition) {
         if (field == null) return;

         let newView = field
            .detailComponent()
            .newInstance(this.application, this);
         if (newView == null) return;

         // set settings to component
         newView.settings = newView.settings ?? {};
         newView.settings.fieldId = field.id;
         newView.settings.labelWidth =
            this.settings.labelWidth ||
            ABViewDetailPropertyComponentDefaults.labelWidth;

         // keep alias to support Query that contains alias name
         // [alias].[columnName]
         newView.settings.alias = field.alias;

         // TODO : Default settings

         newView.position.y = yPosition;

         // add a new component
         this._views.push(newView);

         return newView;
      }
   };
}
