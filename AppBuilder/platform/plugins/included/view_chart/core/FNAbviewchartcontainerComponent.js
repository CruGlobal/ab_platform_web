function findAncestorWithGetDCChart(view) {
   let cur = view && view.parent;
   while (cur) {
      if (typeof cur.getDCChart === "function") return cur;
      cur = cur.parent;
   }
   return null;
}

export default function FNAbviewchartcontainerComponent({
   ABViewComponentPlugin,
}) {
   return class ABviewchartcontainerComponent extends ABViewComponentPlugin {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewChartContainer_${baseView.id}`,
            Object.assign(
               {
                  chartContainer: "",
               },
               ids
            )
         );
      }

      ui(uiChartComponent) {
         const _ui = super.ui([
            Object.assign(
               { id: this.ids.chartContainer },
               uiChartComponent ?? {}
            ),
         ]);

         delete _ui.type;

         return _ui;
      }

      async init(AB) {
         await super.init(AB);
      }

      onShow() {
         super.onShow();
         const baseView = this.view;

         baseView._isShow = true;

         const chartAncestor = findAncestorWithGetDCChart(baseView);
         let dcChart = null;
         if (chartAncestor) {
            if (typeof chartAncestor.refreshData === "function") {
               chartAncestor.refreshData();
            }
            dcChart = chartAncestor.getDCChart();
         } else if (typeof baseView.getDCChart === "function") {
            if (typeof baseView.refreshData === "function") {
               baseView.refreshData();
            }
            dcChart = baseView.getDCChart();
         }
         this.refreshData(dcChart);
      }

      refreshData(dcChart) {
         const $chartContainer = $$(this.ids.chartContainer);
         const $chartComponent = $$(this.ids.component);

         if (dcChart && $chartContainer?.data) {
            $chartContainer.data.sync(dcChart);
         }

         setTimeout(() => {
            $chartComponent?.adjust();
            $chartContainer?.adjust();
         }, 160);
      }
   };
}
