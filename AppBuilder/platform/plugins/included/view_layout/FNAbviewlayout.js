import FNAbviewlayoutComponent from "./FNAbviewlayoutComponent.js";

// FNAbviewlayout Web
// A web side import for an ABView.
//
export default function FNAbviewlayout({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewlayoutComponent = FNAbviewlayoutComponent({
      ABViewComponentPlugin,
   });

   const PropertyComponentDefaults = {
      label: "",
      numColumns: 1, // The number of columns for this layout
   };

   const ABViewDefaults = {
      key: "layout", // {string} unique key for this view
      icon: "columns", // {string} fa-[icon] reference for this view
      labelKey: "Layout", // {string} the multilingual label key for the class label
   };

   class ABViewLayoutCore extends ABViewWidgetPlugin {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABView} parent the ABView this view is a child of. (can be null)
       */
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return PropertyComponentDefaults;
      }

      /**
       * @method addColumn
       * method to actually add a new ABView as one of our columns.
       * This is called by the static .addView() method.
       */
      addColumn() {
         this._views.push(
            this.application.viewNew(
               {
                  key: ABViewContainer.common().key,
               },
               this
            )
         );
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       * @param {bool} isEdited  is this component currently in the Interface Editor
       * @return {array} of ABView objects.
       */
      componentList(isEdited) {
         if (isEdited) {
            // if the layout component is being edited in the editor (isEdited == true)
            // then we return [];
            return [];
         } else {
            // the layout view doesn't care what components are offered, it get's
            // the list from it's parent view.
            // ## NOTE: layout views should not be root views.
            if (this.parent) {
               return this.parent.componentList(false);
            } else {
               return [];
            }
         }
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
   }

   return class ABViewLayout extends ABViewLayoutCore {
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
         return new ABAbviewlayoutComponent(this, parentId);
      }

      warningsEval() {
         super.warningsEval();

         if (this._views.length == 0) {
            this.warningsMessage("has no columns set.");
         }
      }
   };
}
