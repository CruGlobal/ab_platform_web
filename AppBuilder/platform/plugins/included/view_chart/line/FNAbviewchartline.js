import { FNABViewChartCore } from "../chartBindings.js";
import FNAbviewchartlineComponent from "./FNAbviewchartlineComponent.js";

// FNAbviewchartline Web
// A web side import for an ABView.
//
export default function FNAbviewchartline({
   ABViewComponentPlugin,
   ABViewWidgetPlugin,
}) {
   const ABViewChartCore = FNABViewChartCore({ ABViewWidgetPlugin });

   const ABAbviewchartlineComponent = FNAbviewchartlineComponent({
      ABViewComponentPlugin,
   });

   const ABViewChartLinePropertyComponentDefaults = {
      lineType: "line",
      linePreset: "plot",
      isLegend: 1,
      // chartWidth: 600,
      chartHeight: 200,
      labelFontSize: 12,
      stepValue: 20,
      maxValue: 100,
   };

   const ABViewDefaults = {
      key: "line", // {string} unique key for this view
      icon: "line-chart", // {string} fa-[icon] reference for this view
      labelKey: "Line", // {string} the multilingual label key for the class label
   };

   class ABViewChartLineCore extends ABViewChartCore {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewChartLinePropertyComponentDefaults;
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

         this.settings.lineType =
            this.settings.lineType ||
            ABViewChartLinePropertyComponentDefaults.lineType;

         this.settings.linePreset =
            this.settings.linePreset ||
            ABViewChartLinePropertyComponentDefaults.linePreset;

         this.settings.isLegend = parseInt(
            this.settings.isLegend ??
            ABViewChartLinePropertyComponentDefaults.isLegend
         );

         // this.settings.chartWidth = parseInt(this.settings.chartWidth || ABViewChartLinePropertyComponentDefaults.chartWidth);
         this.settings.chartHeight = parseInt(
            this.settings.chartHeight ??
            ABViewChartLinePropertyComponentDefaults.chartHeight
         );

         this.settings.labelFontSize = parseInt(
            this.settings.labelFontSize ??
            ABViewChartLinePropertyComponentDefaults.labelFontSize
         );
         this.settings.stepValue = parseInt(
            this.settings.stepValue ??
            ABViewChartLinePropertyComponentDefaults.stepValue
         );
         this.settings.maxValue = parseInt(
            this.settings.maxValue ??
            ABViewChartLinePropertyComponentDefaults.maxValue
         );

         this.translate(this, this, ["lineLabel"]);
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   }

   return class ABViewChartLine extends ABViewChartLineCore {
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
      component() {
         return new ABAbviewchartlineComponent(this);
      }

      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }
   };
}
