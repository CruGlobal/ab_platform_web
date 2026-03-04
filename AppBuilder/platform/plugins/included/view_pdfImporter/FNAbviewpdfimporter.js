import FNAbviewpdfimporterComponent from "./FNAbviewpdfimporterComponent.js";

// FNAbviewpdfimporter Web
// A web side import for an ABView.
//
export default function FNAbviewpdfimporter({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewpdfimporterComponent = FNAbviewpdfimporterComponent({
      ABViewComponentPlugin,
   });

   const ABSubmitRule = require("../../../../rules/ABViewRuleListFormSubmitRules");

   const ABViewPDFImporterPropertyComponentDefaults = {
      dataviewID: null,
      fieldID: null,

      //	[{
      //		action: {string},
      //		when: [
      //			{
      //				fieldId: {UUID},
      //				comparer: {string},
      //				value: {string}
      //			}
      //		],
      //		value: {string}
      //	}]
      submitRules: [],
   };

   const ABViewDefaults = {
      key: "pdfImporter", // {string} unique key for this view
      icon: "file-pdf-o", // {string} fa-[icon] reference for this view
      labelKey: "PDF Importer", // {string} the multilingual label key for the class label
   };

   class ABViewPDFImporterCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewPDFImporterPropertyComponentDefaults;
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

         this.settings.dataviewID =
            this.settings.dataviewID ??
            ABViewPDFImporterPropertyComponentDefaults.dataviewID;

         this.settings.fieldID =
            this.settings.fieldID ??
            ABViewPDFImporterPropertyComponentDefaults.fieldID;
      }

      /**
       * @method toObj()
       *
       * properly compile the current state of this ABViewLabel instance
       * into the values needed for saving.
       *
       * @return {json}
       */
      toObj() {
         var obj = super.toObj();

         obj.settings = obj.settings ?? {};

         return obj;
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }

      doSubmitRules(rowDatas) {
         const object = this.datacollection.datasource;

         const SubmitRules = new ABSubmitRule();
         SubmitRules.formLoad(this);
         SubmitRules.fromSettings(this.settings.submitRules);
         SubmitRules.objectLoad(object);

         if (rowDatas && !Array.isArray(rowDatas)) rowDatas = [rowDatas];

         rowDatas?.forEach((rowData) => {
            SubmitRules.process({ data: rowData, form: this });
         });
      }
   }

   return class ABViewPDFImporter extends ABViewPDFImporterCore {
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
         return new ABAbviewpdfimporterComponent(this, parentId);
      }
   };
}
