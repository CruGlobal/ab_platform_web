import FNCredentials from "./FNUICredentials.js";
import FNTables from "./FNUITables.js";
import FNFields from "./FNUIFields.js";
import FNFieldTest from "./FNUIFieldTest.js";
import FNUIConnections from "./FNUIConnections.js";

export default function FNPropertiesObjectNetsuiteAPI({
   ABPropertiesObjectPlugin,
   ABUIPlugin,
}) {
   return class ABPropertiesObjectNetsuiteAPI extends ABPropertiesObjectPlugin {
      constructor(...params) {
         super(...params);

         this.width = 820;
         this.height = 650;

         let myBase = ABPropertiesObjectNetsuiteAPI.getPluginKey();
         this.UI_Credentials = FNCredentials(this.AB, myBase, ABUIPlugin);
         this.UI_Tables = FNTables(this.AB, myBase, ABUIPlugin);
         this.UI_Fields = FNFields(this.AB, myBase, ABUIPlugin);
         this.UI_FieldTest = FNFieldTest(this.AB, myBase, ABUIPlugin);
         this.UI_Connections = FNUIConnections(this.AB, myBase, ABUIPlugin);
      }
      static getPluginKey() {
         return "ab-object-netsuite-api";
      }

      header() {
         // this is the name used when choosing the Object Type
         // tab selector.
         let L = this.L();
         return L("Plugin Netsuite API");
      }

      rules() {
         return {
            // name: webix.rules.isNotEmpty,
         };
      }

      elements() {
         let L = this.L();
         // return the webix form element definitions to appear on the page.
         return [
            {
               rows: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Object name"),
                     labelWidth: 70,
                  },
                  {
                     view: "checkbox",
                     label: L("Read Only"),
                     name: "readonly",
                     value: 0,
                     // disabled: true,
                  },
               ],
            },
            {
               view: "tabview",
               cells: [
                  this.UI_Credentials.ui(),
                  this.UI_Tables.ui(),
                  this.UI_Fields.ui(),
                  this.UI_Connections.ui(),
                  this.UI_FieldTest.ui(),
               ],
            },
         ];
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         AB.Webix.extend(this.$form, webix.ProgressBar);

         await this.UI_Credentials.init(AB);
         this.UI_Tables.init(AB);
         this.UI_Fields.init(AB);
         this.UI_Connections.init(AB);
         this.UI_FieldTest.init(AB);

         this.UI_Credentials.show();
         this.UI_Tables.disable();
         this.UI_Fields.disable();
         this.UI_Connections.disable();
         this.UI_FieldTest.disable();

         // "verified" is triggered on the credentials tab once we verify
         // the entered data is successful.
         this.UI_Credentials.on("verified", () => {
            this.UI_Tables.enable();
            let creds = this.UI_Credentials.credentials();
            this.UI_Tables.setCredentials(creds);
            this.UI_Fields.setCredentials(creds);
            this.UI_FieldTest.setCredentials(creds);
            this.UI_Connections.setCredentials(creds);
            this.UI_Tables.show();
         });

         this.UI_Credentials.on("notverified", () => {
            this.UI_Tables.disable();
         });

         this.UI_Tables.on("tables", (tables) => {
            this.UI_Connections.setAllTables(tables);
         });

         this.UI_Tables.on("table.selected", (table) => {
            this.UI_Fields.enable();
            this.UI_Fields.loadFields(table);
            this.UI_Fields.show();
            this.UI_Connections.setTable(table);
            this.UI_FieldTest.setTable(table);
         });

         this.UI_Fields.on("connections", (list) => {
            this.UI_Connections.loadConnections(list);
            this.UI_Connections.enable();
         });

         this.UI_Fields.on("fields.ready", (config) => {
            this.UI_FieldTest.enable();
            this.UI_FieldTest.loadConfig(config);
         });

         this.UI_FieldTest.on("data.verfied", () => {
            $$(this.ids.buttonSave).enable();
         });
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();

         this.UI_Credentials.formClear();
         this.UI_Tables.formClear();
         this.UI_Fields.formClear();
         this.UI_Connections.formClear();
         this.UI_FieldTest.formClear();

         $$(this.ids.buttonSave).disable();
      }

      async formIsValid() {
         var Form = $$(this.ids.form);

         Form?.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            $$(this.ids.buttonSave)?.enable();
            return false;
         }
         return true;
      }

      async formValues() {
         let L = this.L();

         var Form = $$(this.ids.form);
         let values = Form.getValues();

         values.credentials = this.UI_Credentials.getValues();
         values.tableName = this.UI_Tables.getValues();

         let allFields = this.UI_Fields.getValues();

         // Pick out our special columns: pk, created_at, updated_at
         let pkField = allFields.find((f) => f.pk);
         if (!pkField) {
            webix.alert({
               title: L("Error creating Object: {0}", [values.name]),
               ok: L("fix it"),
               text: L("No primary key specified."),
               type: "alert-error",
            });
            return;
         }
         values.primaryColumnName = pkField.column;

         values.columnRef = { created_at: null, updated_at: null };

         ["created_at", "updated_at"].forEach((field) => {
            let foundField = allFields.find((f) => f[field]);
            if (foundField) {
               values.columnRef[field] = foundField.column;
            }
         });

         // Create a new Object
         const object = AB.objectNew(
            Object.assign(
               {
                  isNetsuite: true,
                  plugin_key: ABPropertiesObjectNetsuiteAPI.getPluginKey(),
               },
               values
            )
         );

         try {
            // Add fields

            for (const f of allFields) {
               let def = {
                  name: f.title,
                  label: f.title,
                  columnName: f.column,
                  key: f.abType,
               };
               if (f.default) {
                  def.settings = {};
                  def.settings.default = f.default;
               }
               const field = AB.fieldNew(def, object);
               await field.save(true);

               // values.fieldIDs.push(field.id);
            }
            // values.id = object.id;
         } catch (err) {
            console.error(err);
         }

         let allConnectFields = this.UI_Connections.getValues();
         for (var i = 0; i < allConnectFields.length; i++) {
            let f = allConnectFields[i];
            /* f = 
                {
                    "thisField": "_this_object_",
                    "thatObject": "b7c7cca2-b919-4a90-b199-650a7a4693c1",
                    "thatObjectField": "custrecord_whq_teams_strategy_strtgy_cod",
                    "linkType": "many:one"
                }
            */

            let linkObject = this.AB.objectByID(f.thatObject);
            if (!linkObject) continue;

            let linkType = f.linkType;
            let parts = linkType.split(":");
            let link = parts[0];
            let linkVia = parts[1];

            let thisField = {
               key: "connectObject",
               // columnName: f.thisField,
               label: linkObject.label,
               settings: {
                  showIcon: "1",

                  linkObject: linkObject.id,
                  linkType: link,
                  linkViaType: linkVia,
                  isCustomFK: 0,
                  indexField: "",
                  indexField2: "",
                  isSource: 0,
                  width: 100,
               },
            };

            let linkField = this.AB.cloneDeep(thisField);
            // linkField.columnName = f.thatObjectField;
            linkField.label = object.label || object.name;
            linkField.settings.linkObject = object.id;
            linkField.settings.linkType = linkVia;
            linkField.settings.linkViaType = link;

            switch (linkType) {
               case "one:one":
                  if (f.whichSource == "_this_") {
                     thisField.settings.isSource = 1;
                  } else {
                     linkField.settings.isSource = 1;
                  }
                  thisField.columnName = f.sourceField;
                  linkField.columnName = f.sourceField;
                  break;

               case "one:many":
               case "many:one":
                  thisField.columnName = f.thatField;
                  linkField.columnName = f.thatField;
                  break;

               case "many:many":
                  thisField.settings.joinTable = f.joinTable;
                  linkField.settings.joinTable = f.joinTable;

                  thisField.settings.joinTableReference = f.thisObjReference;
                  linkField.settings.joinTableReference = f.thatObjReference;

                  thisField.settings.joinTablePK = f.joinTablePK;
                  linkField.settings.joinTablePK = f.joinTablePK;

                  thisField.settings.joinTableEntity = f.joinTableEntity;
                  linkField.settings.joinTableEntity = f.joinTableEntity;

                  if (f.joinActiveField != "_none_") {
                     thisField.settings.joinActiveField = f.joinActiveField;
                     thisField.settings.joinActiveValue = f.joinActiveValue;
                     thisField.settings.joinInActiveValue = f.joinInActiveValue;

                     linkField.settings.joinActiveField = f.joinActiveField;
                     linkField.settings.joinActiveValue = f.joinActiveValue;
                     linkField.settings.joinInActiveValue = f.joinInActiveValue;
                  }
                  break;
            }

            // create an initial LinkColumn
            let fieldLink = linkObject.fieldNew(linkField);
            await fieldLink.save(true); // should get an .id now

            // make sure I can reference field => linkColumn
            thisField.settings.linkColumn = fieldLink.id;
            let field = object.fieldNew(thisField);
            await field.save();

            // now update reference linkColumn => field
            fieldLink.settings.linkColumn = field.id;
            await fieldLink.save();
         }

         return object.toObj();
      }
   };
}
