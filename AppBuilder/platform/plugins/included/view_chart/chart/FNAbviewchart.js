import ABViewChartCore from "../../../../../core/views/ABViewChartCore.js";
import FNAbviewchartComponent from "./FNAbviewchartComponent.js";

// FNAbviewchart Web
// A web side import for an ABView.
//
export default function FNAbviewchart({ AB, ABViewContainerComponent }) {
   const ABAbviewchartComponent = FNAbviewchartComponent({
      AB,
      ABViewContainerComponent,
   });

   return class ABViewChart extends ABViewChartCore {
      /**
       * @method getPluginKey
       * return the plugin key for this view.
       * @return {string} plugin key
       */
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component(parentId) {
         return new ABAbviewchartComponent(this, parentId);
      }

      fromValues(values) {
         super.fromValues(values);
         this.refreshData();
      }

      getDCChart() {
         if (!this._dcChart) this._dcChart = new webix.DataCollection();

         return this._dcChart;
      }

      refreshData() {
         const dc = this.datacollection;
         if (dc == null) {
            return this.getDCChart();
         }

         const labelCol = this.labelField();
         const valueCol = this.valueField();
         const valueCol2 = this.valueField2();

         if (!labelCol || !valueCol) {
            return this.getDCChart();
         }

         const numberColName = valueCol.columnName;

         let numberColName2 = "";

         if (this.settings.multipleSeries && valueCol2) {
            numberColName2 = valueCol2.columnName;
         }

         const colorList = [
            "#ee4339",
            "#ee9336",
            "#eed236",
            "#d3ee36",
            "#a7ee70",
            "#58dccd",
            "#36abee",
            "#476cee",
            "#a244ea",
            "#e33fc7",
         ];

         const dInfo = dc.getData();

         let results = [];
         let sumData = {};
         let sumNumber = 0;
         let sumNumber2 = 0;
         let countNumber = dInfo.length;

         dInfo.forEach((item) => {
            const labelKey = labelCol.format(item) || item.id;

            let numberVal = parseFloat(item[numberColName] || 0);
            let numberVal2 = null;

            if (this.settings.multipleSeries)
               numberVal2 = parseFloat(item[numberColName2]) || 0;

            switch (valueCol.key) {
               case "formula":
                  numberVal = valueCol.format(item);

                  break;

               case "calculate":
                  numberVal = parseFloat(
                     valueCol.constructor.convertToJs(
                        valueCol.object,
                        valueCol.settings.formula,
                        item,
                        valueCol.settings.decimalPlaces
                     )
                  );

                  break;

               default:
                  break;
            }

            if (sumData[labelKey] == null) {
               let label = labelKey;

               if (labelCol.isConnection) {
                  let relateValues = labelCol.pullRelationValues(item);
                  if (relateValues != null) {
                     if (Array.isArray(relateValues))
                        label = relateValues
                           .map((val) => val.text || "")
                           .join(", ");
                     else label = relateValues.text;
                  }
               }

               if (this.settings.multipleSeries) {
                  sumData[labelKey] = {
                     label: label || item.id,
                     value: 0,
                     value2: 0,
                  };
               } else {
                  sumData[labelKey] = {
                     label: label || item.id,
                     value: 0,
                  };
               }
            }

            sumData[labelKey].value += numberVal;
            sumNumber += numberVal;

            if (this.settings.multipleSeries) {
               sumData[labelKey].value2 += numberVal2;
               sumNumber2 += numberVal2;
            }
         });

         let index = 0;

         for (const key in sumData) {
            let val = sumData[key].value;

            if (val <= 0) continue;

            if (this.settings.isPercentage) {
               val = (val / sumNumber) * 100;
               val = Math.round(val * 100) / 100;
               val = val + " %";
            }

            if (this.settings.multipleSeries) {
               let val2 = sumData[key].value2;

               if (val2 <= 0) continue;

               if (this.settings.isPercentage) {
                  val2 = (val2 / sumNumber2) * 100;
                  val2 = Math.round(val2 * 100) / 100;
                  val2 = val2 + " %";
               }

               results.push({
                  label: sumData[key].label,
                  value: val,
                  value2: val2,
                  color: colorList[index % colorList.length],
                  count: countNumber,
               });
            } else {
               results.push({
                  label: sumData[key].label,
                  value: val,
                  color: colorList[index % colorList.length],
                  count: countNumber,
               });
            }

            index += 1;
         }

         const dcChart = this.getDCChart();

         dcChart.clearAll();
         dcChart.parse(results);
      }

      warningsEval() {
         super.warningsEval();

         let labelField = this.labelField();
         if (!labelField) {
            this.warningsMessage(
               `can't resolve label field[${this.settings.columnLabel}]`
            );
         }

         let valueField = this.valueField();
         if (!valueField) {
            this.warningsMessage(
               `can't resolve value field[${this.settings.columnValue}]`
            );
         }
      }
   };
}
