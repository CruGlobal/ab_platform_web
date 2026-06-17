import FNAbviewdocxbuilderComponent from "./FNAbviewdocxbuilderComponent.js";

// FNAbviewdocxbuilder Web
// A web side import for an ABView.
//
export default function FNAbviewdocxbuilder({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewdocxbuilderComponent = FNAbviewdocxbuilderComponent({
      ABViewComponentPlugin,
   });

   const ABViewDocxBuilderPropertyComponentDefaults = {
      buttonlabel: "Download DOCX",
      dataviewID: null,
      width: 0,
      filename: "", // uuid
      filelabel: "output.docx",
      language: "en", // en
      toolbarBackground: "ab-background-default",
      buttonPosition: "left",
   };

   const ABViewDefaults = {
      key: "docxBuilder", // {string} unique key for this view
      icon: "file-word-o", // {string} fa-[icon] reference for this view
      labelKey: "DOCX Builder", // {string} the multilingual label key for the class label
   };

   class ABViewDocxBuilderCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewDocxBuilderPropertyComponentDefaults;
      }

      ///
      /// Instance Methods
      ///

      /**
       * @method toObj()
       *
       * properly compile the current state of this ABViewLabel instance
       * into the values needed for saving.
       *
       * @return {json}
       */
      toObj() {
         this.unTranslate(this, this, ["filelabel", "buttonlabel"]);

         let obj = super.toObj();
         obj.viewIDs = [];
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

         // convert from "0" => 0
         this.settings.width = parseInt(
            this.settings.width ||
               ABViewDocxBuilderPropertyComponentDefaults.width
         );

         this.translate(this, this, ["filelabel", "buttonlabel"]);
      }

      uploadUrl() {
         // TODO: Convert this to use ABFactory.urlFileUpload() or a ABFieldFile
         // to get the URL:

         // support uploading template when more than one data source is selected
         const object = this.datacollections[0].datasource;

         // NOTE: file-upload API needs to have the id of ANY field.
         const field = object ? object.fields()[0] : null;

         return `/file/upload/${object?.id}/${field?.id}/1`;
      }

      downloadUrl() {
         return `/file/${this.settings.filename}`;
      }

      get languageCode() {
         return (
            this.settings.language ||
            ABViewDocxBuilderPropertyComponentDefaults.language
         );
      }

      get datacollections() {
         let dataviewID = (this.settings || {}).dataviewID;
         if (!dataviewID) return [];

         let dvList = dataviewID.split(",") || [];

         return (
            this.AB.datacollections((dv) => dvList.indexOf(dv.id) > -1) || []
         );
      }
   }

   return class ABViewDocxBuilder extends ABViewDocxBuilderCore {
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
         return new ABAbviewdocxbuilderComponent(this, parentId);
      }

      letUserDownload(blob, filename) {
         const url = window.URL.createObjectURL(blob);

         const a = document.createElement("a");
         a.href = url;
         a.download = filename;
         document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
         a.click();
         a.remove(); //afterwards we remove the element again

         window.URL.revokeObjectURL(url);
      }

      warningsEval() {
         super.warningsEval();

         let DC = this.datacollections || this.datacollection;
         if (!DC) {
            this.warningsMessage(
               `can't resolve it's datacollection[${this.settings.dataviewID}]`
            );
         }

         if (!this.settings.filename) {
            this.warningsMessage("is missing a DOCX template file");
         } else {
            // TODO: should we check for the existance of the file?
            // this isn't currently an async friendly fn, so how?
            // let url = this.downloadUrl();
         }
      }
   };
}
