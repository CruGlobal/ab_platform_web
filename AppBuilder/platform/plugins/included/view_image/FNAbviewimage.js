import FNAbviewimageComponent from "./FNAbviewimageComponent.js";

// FNAbviewimage Web
// A web side import for an ABView.
//
export default function FNAbviewimage({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewimageComponent = FNAbviewimageComponent({
      ABViewComponentPlugin,
   });

   const ABViewImagePropertyComponentDefaults = {
      filename: "",
      width: 200,
      height: 100,
   };

   const ABViewDefaults = {
      key: "image", // {string} unique key for this view
      icon: "picture-o", // {string} fa-[icon] reference for this view
      labelKey: "Image", // {string} the multilingual label key for the class label
   };

   class ABViewImageCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewImagePropertyComponentDefaults;
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

      /**
       * @property datacollection
       * return data source
       * NOTE: this view doesn't track a DataCollection.
       * @return {ABDataCollection}
       */
      get datacollection() {
         return null;
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
         this.settings.width = parseInt(
            this.settings.width || ABViewImagePropertyComponentDefaults.width
         );
         this.settings.height = parseInt(
            this.settings.height || ABViewImagePropertyComponentDefaults.height
         );
      }
   }

   return class ABViewImage extends ABViewImageCore {
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
         return new ABAbviewimageComponent(this, parentId);
      }

      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }

      //
      //	Editor Related
      //

      warningsEval() {
         super.warningsEval();

         if (!this.settings.filename) {
            this.warningsMessage(`has no image set`);
         }
      }
   };
}
