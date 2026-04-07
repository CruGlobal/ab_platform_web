export default function FNAbviewchartComponent({
   AB,
   ABViewContainerComponent,
}) {
   return class FNAbviewchartComponent extends ABViewContainerComponent {
      constructor(baseView, idBase, ids) {
         super(baseView, idBase || `ABViewChart_${baseView.id}`, ids);
      }

      async init(ABParam, accessLevel) {
         await super.init(ABParam, accessLevel);

         const $component = $$(this.ids.component);
         const abWebix = AB.Webix;

         if ($component) abWebix.extend($component, abWebix.ProgressBar);

         const baseView = this.view;
         const dc = baseView.datacollections || baseView.datacollection;

         const ensureDcLoaded = async (d) => {
            if (!d || typeof d.init !== "function") return;
            d.init();
            if (d.dataStatus === d.dataStatusFlag.notInitial) {
               await d.loadData();
            }
         };

         if (Array.isArray(dc)) {
            for (const d of dc) {
               await ensureDcLoaded(d);
            }
         } else if (dc) {
            await ensureDcLoaded(dc);
         }

         if (dc) {
            const eventNames = [
               "changeCursor",
               "cursorStale",
               "create",
               "update",
               "delete",
               "initializedData",
            ];

            ["changeCursor", "cursorStale"].forEach((key) => {
               if (
                  dc.datacollectionLink &&
                  !(key in (dc.datacollectionLink._events ?? []))
               )
                  baseView.eventAdd({
                     emitter: dc.datacollectionLink,
                     eventName: key,
                     listener: () => {
                        baseView.refreshData();
                     },
                  });
            });

            eventNames.forEach((evtName) => {
               baseView.eventAdd({
                  emitter: dc,
                  eventName: evtName,
                  listener: () => {
                     baseView.refreshData();
                  },
               });
            });
         }

         baseView.refreshData();
      }

      onShow() {
         super.onShow();
      }
   };
}
