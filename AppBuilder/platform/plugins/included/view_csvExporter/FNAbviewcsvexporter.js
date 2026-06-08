import FNAbviewcsvexporterComponent from "./FNAbviewcsvexporterComponent.js";


// FNAbviewcsvexporter Web
// A web side import for an ABView.
//
export default function FNAbviewcsvexporter({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer
}) {
   const ABAbviewcsvexporterComponent = FNAbviewcsvexporterComponent({ ABViewComponentPlugin });

   const ABViewCSVExporterDefaults = {
      key: "csvExporter", // unique key identifier for this ABViewForm
      icon: "download", // icon reference: (without 'fa-' )
      labelKey: "CSV Exporter", // {string} the multilingual label key for the class label
   };

   const ABViewCSVExporterPropertyComponentDefaults = {
      dataviewID: null,
      where: null,
      buttonLabel: "Export CSV",
      filename: "exportCSV",
      hasHeader: true,
      width: 150,
      hiddenFieldIds: [],
   };

   class ABViewCSVExporterCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewCSVExporterDefaults
         );
      }

      static common() {
         return ABViewCSVExporterDefaults;
      }

      static defaultValues() {
         return ABViewCSVExporterPropertyComponentDefaults;
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

         // convert to boolean
         if (typeof values.settings.hasHeader == "string")
            this.settings.hasHeader = JSON.parse(values.settings.hasHeader);

         if (this.settings.hasHeader == null)
            this.settings.hasHeader =
               ABViewCSVExporterPropertyComponentDefaults.hasHeader;

         // convert from "0" => 0
         this.settings.width = parseInt(
            values.settings.width ||
            ABViewCSVExporterPropertyComponentDefaults.width
         );

         this.settings.hiddenFieldIds =
            values.settings.hiddenFieldIds ||
            ABViewCSVExporterPropertyComponentDefaults.hiddenFieldIds;
      }
   };

   return class ABViewCSVExporter extends ABViewCSVExporterCore {

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
         return new ABAbviewcsvexporterComponent(this, parentId);
      }




      warningsEval() {
         super.warningsEval();

         let DC = this.datacollection;
         if (!DC) {
            this.warningsMessage(
               `can't resolve it's datacollection[${this.settings.dataviewID}]`
            );
         }
      }
   };

}

