import FNAbviewtabComponent from "./FNAbviewtabComponent.js";

// FNAbviewtab Web
// A web side import for an ABView.
//
export default function FNAbviewtab({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewtabComponent = FNAbviewtabComponent({ ABViewComponentPlugin });

   const ABViewTabPropertyComponentDefaults = {
      height: 0,
      minWidth: 0,
      stackTabs: 0, // use sidebar view instead of tabview
      darkTheme: 0, // set dark theme css or not
      sidebarWidth: 200, // width of sidebar menu when stacking tabs
      sidebarPos: "left", // the default position of sidebar
      iconOnTop: 0, // do you want to put the icon above the text label?
      hintID: null, // store the ID of a webix hint tutorial for this view
   };

   const ABViewTabDefaults = {
      key: "tab", // {string} unique key for this view
      icon: "window-maximize", // {string} fa-[icon] reference for this view
      labelKey: "Tab(plugin)", // {string} the multilingual label key for the class label
   };

   class ABViewTabCore extends ABViewWidgetPlugin {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABViewWidget} parent the ABViewWidget this view is a child of. (can be null)
       */
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewTabDefaults);
      }

      static common() {
         return ABViewTabDefaults;
      }

      static defaultValues() {
         return ABViewTabPropertyComponentDefaults;
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

         // convert from "0" => 0
         this.settings.height = parseInt(this.settings.height);
         this.settings.minWidth = parseInt(this.settings.minWidth || 0);
         this.settings.stackTabs = parseInt(this.settings.stackTabs);
         this.settings.darkTheme = parseInt(this.settings.darkTheme);
         this.settings.sidebarWidth = parseInt(this.settings.sidebarWidth);
         // this.settings.sidebarPos = this.settings.sidebarPos;
         this.settings.iconOnTop = parseInt(this.settings.iconOnTop);
      }

      addTab(tabName, tabIcon) {
         return this.application
            .viewNew(
               {
                  key: ABViewContainer.common().key,
                  label: tabName,
                  tabicon: tabIcon,
               },
               this.application,
               this
            )
            .save();
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   }

   return class ABViewTab extends ABViewTabCore {
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
         return new ABAbviewtabComponent(this, parentId);
      }

      warningsEval() {
         super.warningsEval();

         let allViews = this.views();

         if (allViews.length == 0) {
            this.warningsMessage("has no tabs set");
         }

         // NOTE: this is done in ABView:
         // (this.views() || []).forEach((v) => {
         //    v.warningsEval();
         // });
      }
   };
}
