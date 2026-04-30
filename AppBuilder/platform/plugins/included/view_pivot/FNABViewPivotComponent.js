export default function FNAbviewpivotComponent({
   AB,
   ABViewComponentPlugin,
}) {
   return class ABAbviewpivotComponent extends ABViewComponentPlugin {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewPivot_${baseView.id}`,
            Object.assign({ pivot: "" }, ids)
         );

         // refresh the widget by id.
         this._handler_refreshPivot = () => {
            const ids = this.ids;
            $$(ids.pivot)?.refresh?.();
         };
      }

      async init(AB) {
         await super.init(AB);

         const dc = this.datacollection;
         if (!dc) return;

         dc.removeListener("initializedData", this._handler_refreshPivot);
         dc.on("initializedData", this._handler_refreshPivot);

         dc.removeListener("loadData", this._handler_refreshPivot);
         dc.on("loadData", this._handler_refreshPivot);
      }

      /**
       * Remove DC listeners
       */
      detatch() {
         const dc = this.datacollection;
         if (!dc) return;

         dc.removeListener("initializedData", this._handler_refreshPivot);
         dc.removeListener("loadData", this._handler_refreshPivot);
      }

      ui() {
         const ids = this.ids;
         const ABFieldCalculate = AB.Class.ABFieldManager.fieldByKey("calculate");
         const ABFieldNumber = AB.Class.ABFieldManager.fieldByKey("number");
         const ABFieldFormula = AB.Class.ABFieldManager.fieldByKey("formula");

         const self = this;
         const settings = this.settings;

         const uiPivot = {
            id: ids.pivot,
            view: "pivot",
            readonly: true,
            removeMissed: settings.removeMissed,
            totalColumn: settings.totalColumn,
            separateLabel: settings.separateLabel,
            min: settings.min,
            max: settings.max,
            height: settings.height,
            fields: this._getFields(),
            format: (value) => {
               const decimalPlaces = settings.decimalPlaces ?? 2;

               return value && value != "0"
                  ? parseFloat(value).toFixed(decimalPlaces || 0)
                  : value;
            },
            override: new Map([
               [
                  pivot.services.Backend,
                  class MyBackend extends pivot.services.Backend {
                     async data() {
                        const dc = self.datacollection;
                        if (!dc) return webix.promise.resolve([]);

                        const object = dc.datasource;
                        if (!object) return webix.promise.resolve([]);

                        await dc.waitReady();

                        const data = dc.getData();
                        const dataMapped = data.map((d) => {
                           const result = {};

                           object.fields().forEach((f) => {
                              if (
                                 f instanceof ABFieldCalculate ||
                                 f instanceof ABFieldFormula ||
                                 f instanceof ABFieldNumber
                              )
                                 result[f.columnName] = d[f.columnName];
                              else result[f.columnName] = f.format(d);
                           });

                           return result;
                        });

                        return webix.promise.resolve(dataMapped);
                     }
                  },
               ],
               [
                  pivot.views.table,
                  class CustomTable extends pivot.views.table {
                     /**
                      * Webix Pivot UpdateTable uses `if (data.totalColumn)`; loadError()
                      * returns totalColumn: [] which is truthy with header: [], causing
                      * data.header[last].id to throw. Strip totalColumn when header empty.
                      */
                     UpdateTable(data) {
                        if (
                           data &&
                           !data.$ready &&
                           data.totalColumn &&
                           !data.header?.length
                        ) {
                           data = { ...data };
                           delete data.totalColumn;
                        }
                        return super.UpdateTable(data);
                     }

                     CellFormat(value) {
                        const decimalPlaces = settings.decimalPlaces ?? 2;
                        if (!value) value = value === 0 ? "0" : "";
                        return value
                           ? parseFloat(value).toFixed(decimalPlaces)
                           : value;
                     }
                  },
               ],
            ]),
         };

         if (settings.structure) uiPivot.structure = settings.structure;

         const _ui = super.ui([uiPivot]);
         delete _ui.type;

         return _ui;
      }

      _getFields() {
         const dc = this.datacollection;
         if (!dc) return [];

         const object = dc.datasource;
         if (!object) return [];

         const fields = object.fields().map((f) => {
            let fieldType = "text";

            switch (f.key) {
               case "calculate":
               case "formula":
               case "number":
                  fieldType = "number";
                  break;
               case "date":
               case "datetime":
                  fieldType = "date";
                  break;
            }

            return {
               id: f.columnName,
               value: f.label,
               type: fieldType,
            };
         });

         return fields;
      }

      async onShow() {
         const ids = this.ids;
         super.onShow();

         const dc = this.datacollection;
         if (!dc) return;

         const object = dc.datasource;
         if (!object) return;

         await dc.waitReady();

         $$(ids.pivot)?.refresh?.();
      }
   };
}
