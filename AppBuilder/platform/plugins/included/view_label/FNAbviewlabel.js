import FNViewLabelComponent from "./FNAbviewLabelComponent.js";


// FNViewLabel Web
// A web side import for an ABView.
//
export default function FNViewLabel({
   /*AB,*/
   ABViewPlugin,
   ABViewComponentPlugin,
}) {
   const ABViewLabelComponent = FNViewLabelComponent({ ABViewComponentPlugin });


   // Define the default values for this components settings:
   // when a new instance of your widget is created, these values will be
   // the default settings
   const ABViewLabelComponentDefaults = {
      text: "",
   };

   // Define the Default Values for this ABView
   // These are used by the platform and ABDesigner to display the view.
   const ABViewDefaults = {
      key: "label",
      // {string}
      // unique key for this view

      icon: "font",
      // {string}
      // fa-[icon] reference for this view

      labelKey: "Plugin ab-view-view-label",
      // {string}
      // the multilingual label key for the class label
   };

   ///
   /// We return the ABView here
   ///
   return class ABViewLabel extends ABViewPlugin {
      // constructor(...params) {
      //    super(...params);
      // }

      /**
       * @method getPluginKey
       * return the plugin key for this view.
       * @return {string} plugin key
       */
      static getPluginKey() {
         return "ab-view-view-label";
      }

      /**
       * @method common
       * return the common values for this view.
       * @return {obj} common values
       */
      static common() {
         return ABViewDefaults;
      }

      /**
       * @method defaultValues
       * return the default values for this view.
       * @return {obj} default values
       */
      static defaultValues() {
         return ABViewLabelComponentDefaults;
      }

      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component(parentId) {
         return new ABViewLabelComponent(this, parentId);
      }

      /**
       * @method toObj()
       * properly compile the current state of this ABView instance
       * into the values needed for saving to the DB.
       * @return {json}
       */
      toObj() {
         // NOTE: ABView auto translates/untranslates "label"
         // add in any additional fields here:
         // this.unTranslate(this, this, ["text"]);

         var obj = super.toObj();
         obj.views = [];
         return obj;
      }

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         this.settings = this.settings || {};

         // NOTE: ABView auto translates/untranslates "label"
         // add in any additional fields here:
         // this.translate(this, this, ["text"]);
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         // NOTE: if your component allows other components to be placed inside, then
         // return the list of components that are allowed to be placed inside.
         // otherwise return an empty array.
         return [];
      }
   };
}

