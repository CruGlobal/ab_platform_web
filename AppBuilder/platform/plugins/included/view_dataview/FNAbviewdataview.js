import FNAbviewdataviewComponent from "./FNAbviewdataviewComponent.js";
import FNABViewDetail from "../view_detail/FNAbviewdetail.js";

// FNAbviewdataview Web
// A web side import for an ABView.
//
export default function FNAbviewdataview({
   AB,
   ABViewComponentPlugin,
   ABViewContainer,
   ABViewContainerComponent,
   ABViewPropertyLinkPage,
}) {
   const ABAbviewdataviewComponent = FNAbviewdataviewComponent({
      AB,
      ABViewComponentPlugin,
      ABViewContainerComponent,
      ABViewPropertyLinkPage,
   });

   const ABViewDataviewPropertyComponentDefaults = {
      xCount: 1, // {int} the number of columns per row (need at least one)
      detailsPage: "",
      detailsTab: "",
      editPage: "",
      editTab: "",
   };

   const ABViewDataviewDefaults = {
      key: "dataview", // {string} unique key for this view
      icon: "th", // {string} fa-[icon] reference for this view
      labelKey: "Data view(plugin)", // {string} the multilingual label key for the class label
   };

   const ABViewDetail = FNABViewDetail({
      ABViewContainer,
      ABViewContainerComponent,
   });

   class ABViewDataviewCore extends ABViewDetail {
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
            defaultValues ?? ABViewDataviewDefaults
         );
      }

      static common() {
         return ABViewDataviewDefaults;
      }

      static defaultValues() {
         return ABViewDataviewPropertyComponentDefaults;
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

         this.settings.xCount = parseInt(
            this.settings.xCount ??
            ABViewDataviewPropertyComponentDefaults.xCount
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
            this.settings.editTab ??
            ABViewDataviewPropertyComponentDefaults.editTab;
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
   }

   return class ABViewDataview extends ABViewDataviewCore {
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
         return new ABAbviewdataviewComponent(this, parentId);
      }

      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }


   };
}
