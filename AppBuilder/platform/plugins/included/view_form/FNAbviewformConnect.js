import FNAbviewformConnectComponent from "./viewComponent/FNAbviewformConnectComponent.js";

export default function FNAbviewformConnect({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormConnectCore,
   ABViewPropertyAddPage,
   ABViewPropertyEditPage,
}) {
   const ABAbviewformConnectComponent = FNAbviewformConnectComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormConnect extends ABViewFormConnectCore {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABView} parent the ABView this view is a child of. (can be null)
       */
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues);

         // Set filter value
         this.__filterComponent = this.AB.filterComplexNew(
            `${this.id}__filterComponent`
         );
         this.__filterComponent.fieldsLoad(
            this.datasource ? this.datasource.fields() : [],
            this.datasource ? this.datasource : null
         );

         this.__filterComponent.setValue(
            this.settings.filterConditions ??
               this.constructor.defaultValues().filterConditions
         );
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

         this.addPageTool.fromSettings(this.settings);
         this.editPageTool.fromSettings(this.settings);
      }

      static get addPageProperty() {
         return ABViewPropertyAddPage.propertyComponent(this.App, this.idBase);
      }

      static get editPageProperty() {
         return ABViewPropertyEditPage.propertyComponent(this.App, this.idBase);
      }

      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformConnectComponent(this);
      }

      get addPageTool() {
         if (this.__addPageTool == null)
            this.__addPageTool = new ABViewPropertyAddPage();

         return this.__addPageTool;
      }

      get editPageTool() {
         if (this.__editPageTool == null)
            this.__editPageTool = new ABViewPropertyEditPage();

         return this.__editPageTool;
      }
   };
}
