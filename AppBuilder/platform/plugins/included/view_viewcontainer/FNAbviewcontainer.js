import FNAbviewcontainerComponent from "./FNAbviewcontainerComponent.js";

// FNAbviewcontainer Web
// A web side import for an ABView.
//
export default function FNAbviewcontainer({
   /*AB,*/
   ABViewPlugin,
   ABViewComponentPlugin,
}) {
   const ABAbviewcontainerComponent = FNAbviewcontainerComponent({
      ABViewComponentPlugin,
   });

   /*
    * ABViewContainerCore
    *
    * An ABViewContainerCore defines a UI display component.
    *
    * A container might have multiple columns of display info.
    *
    */

   // function L(key, altText) {
   // 	return AD.lang.label.getLabel(key) || altText;
   // }

   const ABViewDefaults = {
      key: "viewcontainer", // {string} unique key for this view
      icon: "braille", // {string} fa-[icon] reference for this view
      labelKey: "Container", // {string} the multilingual label key for the class label
   };

   const ABPropertyComponentDefaults = {
      columns: 1,
      gravity: 1,
      movable: true,
      removable: true,
   };

   class ABViewContainerCore extends ABViewPlugin {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABView} parent the ABView this view is a child of. (can be null)
       * @param {obj} defaultValues special sub class defined default values.
       */
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABPropertyComponentDefaults;
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
         this.settings.columns = parseInt(
            this.settings.columns || ABPropertyComponentDefaults.columns,
         );

         if (typeof this.settings.gravity != "undefined") {
            this.settings.gravity.map(function (gravity) {
               return parseInt(gravity);
            });
         }

         if (this.settings.removable != null) {
            this.settings.removable = JSON.parse(this.settings.removable); // convert to boolean
         } else {
            this.settings.removable = ABPropertyComponentDefaults.removable;
         }

         if (this.settings.movable != null) {
            this.settings.movable = JSON.parse(this.settings.movable); // convert to boolean
         } else {
            this.settings.movable = ABPropertyComponentDefaults.movable;
         }
      }

      viewsSortByPosition() {
         // Sort views from y, x positions
         return this.views().sort((a, b) => {
            if (a.position.y == b.position.y)
               return a.position.x - b.position.x;
            else return a.position.y - b.position.y;
         });
      }

      // saveReorder() {
      //    return this.application.viewReorder(this);
      // }
   }

   return class ABViewContainer extends ABViewContainerCore {
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
         return new ABAbviewcontainerComponent(this, parentId);
      }

      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }

      warningsEval() {
         super.warningsEval();

         let allViews = this.views();

         if (allViews.length == 0) {
            this.warningsMessage("has no content");
         }

         // NOTE: this is done in ABView:
         // (allViews || []).forEach((v) => {
         //    v.warningsEval();
         // });
      }
   };
}
