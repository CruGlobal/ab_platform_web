export default function (ABViewWidget) {
   return class ABViewDetailItemCore extends ABViewWidget {
      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }

      detailComponent() {
         let detailView = null;

         let curr = this;
         while (
            !curr.isRoot() &&
            curr.parent &&
            curr.key != "detail" &&
            curr.key != "dataview"
         ) {
            curr = curr.parent;
         }

         if (curr.key == "detail" || curr.key == "dataview") {
            detailView = curr;
         }

         return detailView;
      }

      field() {
         let detailComponent = this.detailComponent();
         if (detailComponent == null) return null;

         let datacollection = detailComponent.datacollection;
         if (datacollection == null) return null;

         let object = datacollection.datasource;
         if (object == null) return null;

         let field = object.fields((v) => v.id == this.settings.fieldId)[0];

         // set .alias to support queries that contains alias name
         // [aliasName].[columnName]
         if (field && this.settings.alias) {
            field.alias = this.settings.alias;
         }

         return field;
      }

      getCurrentData() {
         let detailCom = this.detailComponent();
         if (!detailCom) return null;

         let dv = detailCom.datacollection;
         if (!dv) return null;

         let field = this.field();
         if (!field) return null;

         let currData = dv.getCursor();
         if (currData) return currData[field.columnName];
         else return null;
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }

      /**
       * @property datacollection
       * return data source
       * NOTE: this view doesn't track a DataCollection.
       * @return {ABDataCollection}
       */
      get datacollection() {
         return null;
      }
   };
}
