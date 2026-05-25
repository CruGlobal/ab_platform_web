import FNAbviewgridComponent from "./FNAbviewgridComponent.js";
import ABViewGridFilter from "../../../views/viewProperties/ABViewPropertyFilterData.js";
import ABViewPropertyLinkPage from "../../../views/viewProperties/ABViewPropertyLinkPage.js";


// FNAbviewgrid Web
// A web side import for an ABView.
//
export default function FNAbviewgrid({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
   ABViewPopupSortFields,
}) {
   const ABAbviewgridComponent = FNAbviewgridComponent({
      ABViewComponentPlugin,
      ABViewPopupSortFields,
   });

const ABViewGridPropertyComponentDefaults = {
   label: "",
   // {string}
   // label is required and you can add more if the component needs them

   // format:0  	// 0 - normal, 1 - title, 2 - description
   dataviewID: "",
   // {uuid}
   // uuid of ABDataCollection that drives the data for our Grid

   padding: 17,
   // {int}
   // the default padding surrounding the component

   showToolbar: 1,
   // {bool}
   // do we show our toolbar?

   isEditable: 0,
   // {bool}
   // do we allow editing in the grid?

   massUpdate: 0,
   // {bool}
   // do we allow the Mass Update capability? (row checkboxes and the
   // MassUpdate popup)

   allowDelete: 0,
   // {bool}
   // do we allow deleting multiple rows at a time? Mass Delete.

   // isFilterable:0,

   isSortable: 1,
   // {bool}
   // do we allow the sort options.

   isExportable: 0,
   // {bool}
   // do we enable the webix export from grid capabilities?

   // linkedObject:'',
   // linkedField:'',
   // linkedPage:'',
   // linkedPageView:'',
   // linkedEditPage:'',
   // linkedEditPageForm:'',

   detailsPage: "",
   // {ABViewPage.id}
   // the ABViewPage that has the details component.

   detailsTab: "",
   // {ABViewTab.id}
   // the ABViewTab component, that has the details component.
   // NOTE: if your details is embedded on a TAB, we need both the
   // .detailsPage & .detailsTab to successfully show the item.

   editPage: "",
   // {ABViewPage.id}
   // the ABViewPage that has the edit component.

   editTab: "",
   // {ABViewTab.id}
   // the ABViewTab component, that has the edit component.
   // NOTE: if your editor is embedded on a TAB, we need both the
   // .editPage & .editTab to successfully show the form.

   trackView: 0,
   // {bool}
   // Do we offer the ability to track changes to this object/row?

   frozenColumnID: "",
   // {ABField.id}
   // id of column you want to stop freezing the left hand side at.

   hiddenFields: [],
   // {array}  [ ABField.id, ABField.id, ... ]
   // array of [ids] to add hidden:true to

   summaryColumns: [],
   // {array}  [ ABField.id, ABField.id, ... ]
   // array of [ids] to add the SUM footer to

   countColumns: [],
   // {array}  [ ABField.id, ABField.id, ... ]
   // array of [ids] to add the Count footer to

   // TODO: get rid of objectWorkspace!
   objectWorkspace: {
      // sortFields:[], // array of columns with their sort configurations
      // filterConditions:[], // array of filters to apply to the data table
      frozenColumnID: "", // id of column you want to stop freezing
      hiddenFields: [], // array of [ids] to add hidden:true to
      summaryColumns: [],
      countColumns: [],
   },
   gridFilter: {
      filterOption: 1,
      userFilterPosition: "toolbar",
      isGlobalToolbar: 1,
   },
   // summaryFields: [], // array of [field ids] to add the summary column in footer
   // countFields: [], // array of [field ids] to add the summary column in footer

   height: 0,
   // {int}
   // The Height of our Grid.
   // See ../views/ABViewDataview.js

   hideHeader: 0,
   labelAsField: 0,
   hideButtons: 0,
   groupBy: "", // id of field

   // TODO: add to ABDesigner.interface design:
   columnConfig: [],
   // {array} [ {columnHeader}, {columnHeader} ... ]
   // An array of column headers for the grid to display. These should
   // be generated at Design time, and can allow the designer to ORDER the
   // columns, assign column widths, fillspace, etc...
   //    {columnHeader}
   //    The minimum amount of information a Grid needs for it's customization
   //    .id {string} ABField.columnName
   //    .fieldId {string} ABField.id
   //    .width {int}
   //    .fillspace {bool}
   //    .minwidth
   //
   //    When displaying column headers, we will ask the
   //    CurrentObject.columnHeaders(), and then modify them with our settings
   //    here.

   saveLocal: 1,
   // {bool}
   // Allow saving of local changes to our grid display. This will enable
   // a user to modify the Grid display locally.
};

const ABViewDefaults = {
   key: "grid", // {string} unique key for this view
   icon: "table", // {string} fa-[icon] reference for this view
   labelKey: "Grid", // {string} the multilingual label key for the class label
};

/**
 * @function settingsDefault()
 * Verifies a given field is set and if not, defaults to what we havein our
 * ABViewGridPropertyComponentDefaults.
 * NOTE: use this fn() for values that are NOT TRUTHY ... so not for numeric
 * 1 or 0.
 * @param {hash} base
 *        The current settings value hash.
 * @param {string} field
 *        The parameter we are checking.
 */
function settingsDefault(base, field) {
   if (typeof base[field] == "undefined") {
      base[field] = ABViewGridPropertyComponentDefaults[field];
      return;
   }
   base[field] = base[field] || ABViewGridPropertyComponentDefaults[field];
}

/**
 * @function settingsDefaultJSON()
 * Verifies a given field is set and if not, defaults to what we havein our
 * ABViewGridPropertyComponentDefaults.
 * NOTE: use this fn() for values that ARE TRUTHY ... so for numeric 1 or 0
 * @param {hash} base
 *        The current settings value hash.
 * @param {string} field
 *        The parameter we are checking.
 */
function settingsDefaultJSON(base, field) {
   try {
      if (typeof base[field] == "string") {
         base[field] = JSON.parse(base[field]);
      }
   } catch (e) {
      base[field] = ABViewGridPropertyComponentDefaults[field];
   }
}

class ABViewGridCore extends ABViewWidgetPlugin {
   /**
    * @param {obj} values  key=>value hash of ABView values
    * @param {ABApplication} application the application object this view is under
    * @param {ABViewWidget} parent the ABViewWidget this view is a child of. (can be null)
    */
   constructor(values, application, parent, defaultValues) {
      super(values, application, parent, defaultValues || ABViewDefaults);
   }

   static common() {
      return ABViewDefaults;
   }

   static defaultValues() {
      return ABViewGridPropertyComponentDefaults;
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

      // if this is being instantiated on a read from the Property UI,
      settingsDefault(this.settings, "dataviewID");

      // Convert to boolean
      // these values are sometimes 0 (number) at this point so the JSON.parse
      // with the || (or) statement was always falling to the default so I am
      // trying to parse the value...if it fails we use the default value
      settingsDefaultJSON(this.settings, "padding");
      settingsDefaultJSON(this.settings, "showToolbar");
      settingsDefaultJSON(this.settings, "isEditable");
      settingsDefaultJSON(this.settings, "massUpdate");
      settingsDefaultJSON(this.settings, "allowDelete");
      // this.settings.isFilterable = JSON.parse(this.settings.isFilterable || ABViewGridPropertyComponentDefaults.isFilterable);
      settingsDefaultJSON(this.settings, "isSortable");
      settingsDefaultJSON(this.settings, "isExportable");
      settingsDefaultJSON(this.settings, "hideHeader");
      settingsDefaultJSON(this.settings, "labelAsField");
      settingsDefaultJSON(this.settings, "hideButtons");
      settingsDefaultJSON(this.settings, "columnConfig");
      settingsDefaultJSON(this.settings, "saveLocal");

      this.settings.gridFilter =
         this.settings.gridFilter ||
         ABViewGridPropertyComponentDefaults.gridFilter;

      try {
         this.settings.gridFilter.filterOption = JSON.parse(
            this.settings.gridFilter.filterOption
         );
      } catch (e) {
         this.settings.gridFilter.filterOption =
            ABViewGridPropertyComponentDefaults.gridFilter.filterOption;
      }

      try {
         this.settings.gridFilter.isGlobalToolbar = JSON.parse(
            this.settings.gridFilter.isGlobalToolbar
         );
      } catch (e) {
         this.settings.gridFilter.isGlobalToolbar =
            ABViewGridPropertyComponentDefaults.gridFilter.isGlobalToolbar;
      }

      // this.settings.linkedObject = this.settings.linkedObject || ABViewGridPropertyComponentDefaults.linkedObject;
      // this.settings.linkedField = this.settings.linkedField || ABViewGridPropertyComponentDefaults.linkedField;
      // this.settings.linkedPage = this.settings.linkedPage || ABViewGridPropertyComponentDefaults.linkedPage;
      // this.settings.linkedPageView = this.settings.linkedPageView || ABViewGridPropertyComponentDefaults.linkedPageView;
      // this.settings.linkedEditPage = this.settings.linkedEditPage || ABViewGridPropertyComponentDefaults.linkedEditPage;
      // this.settings.linkedEditPageForm = this.settings.linkedEditPageForm || ABViewGridPropertyComponentDefaults.linkedEditPageForm;

      settingsDefault(this.settings, "detailsPage");
      settingsDefault(this.settings, "editPage");
      settingsDefault(this.settings, "detailsTab");
      settingsDefault(this.settings, "editTab");
      settingsDefaultJSON(this.settings, "trackView");

      // TODO: remove objectworkspace!
      // this.settings.objectWorkspace =
      //    this.settings.objectWorkspace ||
      //    ABViewGridPropertyComponentDefaults.objectWorkspace;

      // if (typeof this.settings.objectWorkspace != "undefined") {
      //    if (typeof this.settings.objectWorkspace.sortFields == "undefined")
      //       this.settings.objectWorkspace.sortFields = [];
      //    if (
      //       typeof this.settings.objectWorkspace.filterConditions == "undefined"
      //    )
      //       this.settings.objectWorkspace.filterConditions = [];
      //    if (typeof this.settings.objectWorkspace.frozenColumnID == "undefined")
      //       this.settings.objectWorkspace.frozenColumnID = "";
      //    if (typeof this.settings.objectWorkspace.hiddenFields == "undefined")
      //       this.settings.objectWorkspace.hiddenFields = [];
      //    if (typeof this.settings.objectWorkspace.summaryColumns == "undefined")
      //       this.settings.objectWorkspace.summaryColumns = [];
      //    if (typeof this.settings.objectWorkspace.countColumns == "undefined")
      //       this.settings.objectWorkspace.countColumns = [];
      // }

      var owFields = [
         "sortFields",
         "filterConditions",
         "frozenColumnID",
         "hiddenFields",
         "summaryColumns",
         "countColumns",
      ];
      // Transition: if we have an .objectWorkspace, copy those values in here:
      if (this.settings.objectWorkspace) {
         owFields.forEach((f) => {
            if (this.settings[f] == null)
               this.settings[f] = this.settings.objectWorkspace[f];
         });
      }

      // make sure they have actual default values now.
      owFields.forEach((f) => {
         settingsDefault(this.settings, f);
      });

      // we are not allowed to have sub views:
      this._views = [];
   }

   /**
    * @method componentList
    * return the list of components available on this view to display in the editor.
    */
   componentList() {
      return [];
   }

   removeField(field, cb) {
      let shouldSave = false;

      // check to see if there is a frozenColumnID and if it matches the
      // deleted field
      if (this.settings?.frozenColumnID == field.columnName) {
         // remove the column name from the frozen column id
         this.settings.frozenColumnID = "";
         // flag the object to be saved later
         shouldSave = true;
      }

      // check to see if there are hidden fields
      if (this.settings.hiddenFields?.length) {
         // find if the deleted field is in the array
         let index = this.settings.hiddenFields.indexOf(field.columnName);
         // if so splice it out of the array
         if (index > -1) {
            this.settings.hiddenFields.splice(index, 1);
            // flag the object to be saved later
            shouldSave = true;
         }
      }

      // check to see if there are Summary fields
      if (this.settings.summaryColumns?.length) {
         // find if the deleted field is in the array
         let index = this.settings.summaryColumns.indexOf(field.id);
         // if so splice it out of the array
         if (index > -1) {
            this.settings.summaryColumns.splice(index, 1);
            // flag the object to be saved later
            shouldSave = true;
         }
      }

      // check to see if there are hidden fields
      if (this.settings.countColumns?.length) {
         // find if the deleted field is in the array
         let index = this.settings.countColumns.indexOf(field.id);
         // if so splice it out of the array
         if (index > -1) {
            this.settings.countColumns.splice(index, 1);
            // flag the object to be saved later
            shouldSave = true;
         }
      }
      // if settings were changed call the callback

      cb(null, shouldSave);
   }

   copyUpdateProperyList() {
      return ["detailsPage", "detailsTab", "editPage", "editTab"];
   }
};


return class ABViewGrid extends ABViewGridCore {

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
         return new ABAbviewgridComponent(this, parentId);
      }


   /**
    * @param {obj} values  key=>value hash of ABView values
    * @param {ABApplication} application the application object this view is under
    * @param {ABViewWidget} parent the ABViewWidget this view is a child of. (can be null)
    */
   // constructor(values, application, parent, defaultValues) {
   //    super(values, application, parent, defaultValues);
   // }

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

      // filter property
      this.filterHelper.fromSettings(this.settings.gridFilter);
   }

   propertyGroupByList(ids, groupBy) {
      let colNames = groupBy || [];
      if (typeof colNames == "string") {
         colNames = colNames.split(",");
      }

      let options = $$(ids.groupBy).getList().data.find({});

      $$(ids.groupByList).clearAll();
      colNames.forEach((colName) => {
         let opt = options.filter((o) => o.id == colName)[0];
         if (opt) {
            $$(ids.groupByList).add(opt);
         }
      });
   }

   

   get filterHelper() {
      if (this.__filterHelper == null) {
         this.__filterHelper = new ABViewGridFilter(
            this.AB,
            `${this.id}_filterHelper`
         );
      }

      return this.__filterHelper;
   }

   get linkPageHelper() {
      if (this.__linkPageHelper == null)
         this.__linkPageHelper = new ABViewPropertyLinkPage();

      return this.__linkPageHelper;
   }

   warningsEval() {
      super.warningsEval();
      let origWS = this.warningsSilent;
      this.warningsSilent = true;
      let DC = this.datacollection;
      this.warningsSilent = origWS;
      if (!DC) {
         this.warningsMessage(
            `can't resolve it's datacollection[${this.settings.dataviewID}]`
         );
      }
   }
}

}

