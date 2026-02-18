import FNAbviewLabelComponent from "./FNAbviewLabelComponent.js";


// FNViewLabel Web
// A web side import for an ABView.
//
export default function FNViewLabel({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewPlugin,
   ABViewComponentPlugin,
}) {
   const ABViewLabelComponent = FNAbviewLabelComponent({ ABViewComponentPlugin });


   // Define the default values for this components settings:
   // when a new instance of your widget is created, these values will be
   // the default settings
   const ABViewLabelComponentDefaults = {
      key: "label", // {string} unique key for this view
      icon: "font", // {string} fa-[icon] reference for this view
      labelKey: "Label", // {string} the multilingual label key for the class label
   };

   // Define the Default Values for this ABView
   // These are used by the platform and ABDesigner to display the view.
   const ABViewDefaults = {
      key: "label", // {string} unique key for this view
      icon: "font", // {string} fa-[icon] reference for this view
      labelKey: "label", // {string} the multilingual label key for the class label
   };

   class ABViewLabelCore extends ABViewPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
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
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values); // <-- this performs the translations
         console.assert(this.settings)
         this.settings = this.settings || {};

         // if this is being instantiated on a read from the Property UI,
         // .text is coming in under .settings.label
         this.text = values.text || values.settings.text || "*text";

         this.settings.format =
            this.settings.format || ABViewLabelPropertyComponentDefaults.format;
         this.settings.alignment =
            this.settings.alignment ||
            ABViewLabelPropertyComponentDefaults.alignment;

         // we are not allowed to have sub views:
         this._views = [];

         // convert from "0" => 0
         this.settings.format = parseInt(this.settings.format);

         // NOTE: ABView auto translates/untranslates "label"
         // add in any additional fields here:
         this.translate(this, this, ["text"]);
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
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         // other components cannot be placed inside
         return [];
      }
      //// Allow external interface to manipulate our settings:
      /**
       * @method formatNormal
       * display text in the normal format.
       */
      formatNormal() {
         this.settings.format = 0;
      }

      /**
       * @method formatTitle
       * display text as a Title.
       */
      formatTitle() {
         this.settings.format = 1;
      }

      /**
       * @method formatDescription
       * display text as a description.
       */
      formatDescription() {
         this.settings.format = 2;
      }
   }

   return class ABViewLabel extends ABViewLabelCore {
      constructor(...params) {
         super(...params);
      }

      /**
       * @method getPluginKey
       * return the plugin key for this view.
       * @return {string} plugin key
       */
      static getPluginKey() {
         return "label";
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

   };
}

