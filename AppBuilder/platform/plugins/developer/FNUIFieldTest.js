export default function FNUIFieldTest(AB, base, ABUIPlugin) {
   let this_base = `${base}-field-test`;
   class UIFieldTest extends ABUIPlugin {
      constructor() {
         super(
            this_base,
            {
               form: "",
               network: "",
               dataView: "",

               buttonVerify: "",
               tableName: "",
            },
            AB
         );

         this.credentials = {};
         // {  CRED_KEY : CRED_VAL }
         // The entered credential references necessary to perform our Netsuite
         // operations.

         this.fieldKeys = [
            "string",
            "LongText",
            "number",
            "date",
            "boolean",
            "json",
            "list",
         ];
         // {array} of types of ABFields we can translate into.

         this.fieldList = null;
         // {array}
         // Holds an array of field descriptions

         this.table = null;
         // {string}
         // name of the table we are working with
      }

      ui() {
         let L = this.L();

         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Data Verification"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 800,
               height: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  // Field Selector
                  {
                     view: "layout",
                     padding: 10,
                     rows: [
                        {
                           cols: [
                              {
                                 id: this.ids.tableName,
                                 label: L("Selected Table: {0}", [this.table]),
                                 view: "label",
                                 height: 40,
                              },
                              {},
                           ],
                        },
                        {
                           view: "multiview",
                           // keepViews: true,
                           cells: [
                              // Select Table indicator
                              {
                                 id: this.ids.network,
                                 rows: [
                                    {},
                                    {
                                       view: "label",
                                       align: "center",
                                       height: 200,
                                       label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-database'></div>",
                                    },
                                    {
                                       view: "label",
                                       align: "center",
                                       label: L(
                                          "Gathering data from Netsuite."
                                       ),
                                    },
                                    {},
                                 ],
                              },
                              {
                                 id: this.ids.dataView,
                                 rows: [
                                    {},
                                    {
                                       view: "label",
                                       label: "Waiting for response",
                                    },
                                    {},
                                 ],
                                 // hidden: true,
                              },
                           ],
                        },

                        // {
                        //    id: this.ids.fieldGrid,
                        //    view: "datatable",
                        //    resizeColumn: true,
                        //    height: 300,
                        //    columns: [
                        //       {
                        //          id: "title",
                        //          header: L("title"),
                        //          editor: "text",
                        //       },
                        //       { id: "column", header: L("column") },

                        //       { id: "nullable", header: L("nullable") },
                        //       { id: "readOnly", header: L("read only") },
                        //       {
                        //          id: "pk",
                        //          header: L("is primary key"),
                        //          template: "{common.radio()}",
                        //       },
                        //       // {
                        //       //    id: "description",
                        //       //    header: L("description"),
                        //       //    fillspace: true,
                        //       // },
                        //       {
                        //          id: "abType",
                        //          header: L("AB Field Type"),
                        //          editor: "select",
                        //          options: [" "].concat(this.fieldKeys),
                        //       },
                        //       {
                        //          id: "delme",
                        //          header: "",
                        //          template: "{common.trashIcon()}",
                        //       },
                        //    ],
                        //    editable: true,
                        //    scroll: "y",
                        //    onClick: {
                        //       "wxi-trash": (e, id) => {
                        //          debugger;
                        //          $$(this.ids.fieldGrid).remove(id);
                        //       },
                        //    },
                        // },
                     ],
                  },

                  {
                     cols: [
                        { fillspace: true },
                        // {
                        //    view: "button",
                        //    id: this.ids.buttonCancel,
                        //    value: L("Cancel"),
                        //    css: "ab-cancel-button",
                        //    autowidth: true,
                        //    click: () => {
                        //       this.cancel();
                        //    },
                        // },
                        {
                           view: "button",
                           id: this.ids.buttonVerify,
                           css: "webix_primary",
                           value: L("Verify"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.verify();
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         AB.Webix.extend(this.$form, webix.ProgressBar);
      }

      disable() {
         $$(this.ids.form).disable();
      }

      enable() {
         $$(this.ids.form).enable();
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();

         // reset the data view to blank
         let table = {
            id: this.ids.dataView,
            rows: [
               {},
               {
                  view: "label",
                  label: "Waiting for response",
               },
               {},
            ],
            // hidden: true,
         };
         webix.ui(table, $$(this.ids.dataView));
         this.disable();
      }

      setTableName() {
         $$(this.ids.tableName).setValue(
            `<span style="font-size: 1.5em; font-weight:bold">${this.table}</span>`
         );
      }

      setTable(table) {
         this.table = table;
         this.setTableName();

         // this is called when a table name has been selected.
         // but we need to be disabled until they have verified the
         // fields.
         this.formClear();
      }

      async loadConfig(config) {
         this.credentials = config.credentials;
         this.setTable(config.table);
         this.fieldList = config.fieldList;

         $$(this.ids.network).show();
         this.busy();

         let result = await this.AB.Network.get({
            url: `/netsuite/dataVerify/${this.table}`,
            params: {
               credentials: JSON.stringify(this.credentials),
            },
         });

         this.data = result;
         // this.ids.dataView,

         // convert all the json types to strings for display:
         this.fieldList
            .filter((f) => f.abType == "json")
            .forEach((f) => {
               this.data.forEach((d) => {
                  try {
                     d[f.column] = JSON.stringify(d[f.column]);
                  } catch (e) {
                     console.log(e);
                  }
               });
            });

         this.showTable();
         this.enable();
         this.ready();
      }

      showTable() {
         let table = {
            id: this.ids.dataView,
            view: "datatable",
            columns: this.fieldList.map((f) => {
               return {
                  id: f.column,
                  header: f.title,
               };
            }),
            data: this.data,
         };

         webix.ui(table, $$(this.ids.dataView));
         $$(this.ids.dataView).show();
      }

      verify() {
         this.emit("data.verfied");
      }

      busy() {
         const $verifyButton = $$(this.ids.buttonVerify);

         this.$form.showProgress({ type: "icon" });
         $verifyButton.disable();
      }

      ready() {
         const $verifyButton = $$(this.ids.buttonVerify);

         this.$form.hideProgress();
         $verifyButton.enable();
      }

      setCredentials(creds) {
         this.credentials = creds;
      }
   }
   return new UIFieldTest();
}
