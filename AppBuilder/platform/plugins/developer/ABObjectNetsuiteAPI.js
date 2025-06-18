export default function FNObjectNetsuiteAPI({ ABObjectPlugin, ABModelPlugin }) {
   //
   // Our ABModel for interacting with the website
   //
   class ABModelNetsuiteAPI extends ABModelPlugin {
      /**
       * @method normalizeData()
       * For a Netsuite object, there are additional steps we need to handle
       * to normalize our data.
       */
      normalizeData(data) {
         super.normalizeData(data);

         if (!Array.isArray(data)) {
            data = [data];
         }

         var boolFields = this.object.fields((f) => f.key == "boolean");
         let allFields = this.object.fields();

         data.forEach((d) => {
            // Netsuite sometimes keeps keys all lowercase
            // which might not match up with what it told us in the meta-catalog
            // which we need:
            for (var i = 0; i < allFields.length; i++) {
               let actualColumn = allFields[i].columnName;
               let lcColumn = actualColumn.toLowerCase();

               if (
                  typeof d[actualColumn] == "undefined" &&
                  typeof d[lcColumn] != "undefined"
               ) {
                  d[actualColumn] = d[lcColumn];
                  delete d[lcColumn];
               }
            }

            // Netsuite Booleans are "T" or "F"
            boolFields.forEach((bField) => {
               let val = d[bField.columnName];
               // just how many ways can a DB indicate True/False?
               if (typeof val == "string") {
                  val = val.toLowerCase();

                  if (val === "t") val = true;
                  else val = false;

                  d[bField.columnName] = val;
               }
            });
         });
      }
   }

   ///
   /// We return the ABObject here
   ///
   return class ABObjectNetsuiteAPI extends ABObjectPlugin {
      constructor(...params) {
         super(...params);

         this.isNetsuite = true;
      }
      static getPluginKey() {
         return "ab-object-netsuite-api";
      }

      fromValues(attributes) {
         super.fromValues(attributes);

         this.credentials = attributes.credentials ?? {};
         this.columnRef = attributes.columnRef ?? {};
      }

      /**
       * @method toObj()
       *
       * properly compile the current state of this ABObjectQuery instance
       * into the values needed for saving to the DB.
       *
       * @return {json}
       */
      toObj() {
         const result = super.toObj();
         result.plugin_key = this.constructor.getPluginKey();
         result.isNetsuite = true;
         result.credentials = this.credentials;
         result.columnRef = this.columnRef;

         return result;
      }

      /**
       * @method model
       * return a Model object that will allow you to interact with the data for
       * this ABObjectQuery.
       */
      model() {
         var model = new ABModelNetsuiteAPI(this);

         // default the context of this model's operations to this object
         model.contextKey(this.constructor.contextKey());
         model.contextValues({ id: this.id }); // the datacollection.id

         return model;
      }
   };
} // end of FNObjectNetsuiteAPI
