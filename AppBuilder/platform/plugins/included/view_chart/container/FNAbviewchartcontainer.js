import ABviewchartcontainerComponent from "./FNAbviewchartcontainerComponent.js";

// FNAbviewchartcontainer Web
// A web side import for an ABView.
//
export default function FNAbviewchartcontainer({
   /*AB,*/
   ABViewComponentPlugin,
   ABViewWidgetPlugin,
}) {
   const ABViewChartContainerComponent = ABviewchartcontainerComponent({
      ABViewComponentPlugin,
   });

   return class ABViewChartContainer extends ABViewWidgetPlugin {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABViewChartContainerComponent(this);
      }

      get datacollection() {
         return this.parent.datacollection;
      }

      static getPluginType() {
         return "view";
      }
   };
}
