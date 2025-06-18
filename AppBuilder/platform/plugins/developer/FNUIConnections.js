export default function FNUIConnections(AB, keyPlugin, ABUIPlugin) {
   let this_base = `${keyPlugin}-connections`;
   class UIConnections extends ABUIPlugin {
      constructor() {
         super(
            this_base,
            {
               form: "",

               // fieldSelector: "",
               connections: "",
               displayConnections: "",
               displayNoConnections: "",

               fieldGrid: "",
               buttonVerify: "",
               buttonLookup: "",
               tableName: "",
            },
            AB
         );

         this.allTables = [];
         // [ { id, name }, ... ]
         // A list of all the available tables. This is used for identifying the
         // join tables in many:many connections.
         // We get this list from the Tables interface tab.

         this.credentials = {};
         // {  CRED_KEY : CRED_VAL }
         // The entered credential references necessary to perform our Netsuite
         // operations.

         this.connectionList = null;
         // {array}
         // Holds an array of connection descriptions

         this.connections = null;
         // {array}
         // Holds the array of chosen/verified connections
      }

      ui() {
         let L = this.L();
         let uiConfig = this.AB.Config.uiSettings();

         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Connections"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 800,
               height: 450,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  {
                     view: "layout",
                     padding: 10,
                     rows: [
                        {
                           id: this.ids.tableName,
                           label: L("Selected Table: {0}", [this.table]),
                           view: "label",
                           height: 40,
                        },
                     ],
                  },

                  // Field Selector
                  {
                     view: "multiview",
                     animate: false,
                     borderless: true,
                     rows: [
                        {
                           id: this.ids.displayNoConnections,
                           rows: [
                              {
                                 maxHeight: uiConfig.xxxLargeSpacer,
                                 hidden: uiConfig.hideMobile,
                              },
                              {
                                 view: "label",
                                 align: "center",
                                 height: 200,
                                 label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-exclamation-triangle'></div>",
                              },
                              {
                                 // id: ids.error_msg,
                                 view: "label",
                                 align: "center",
                                 label: L(
                                    "You have no other Netsuite Objects imported"
                                 ),
                              },
                              {
                                 // id: ids.error_msg,
                                 view: "label",
                                 align: "center",
                                 label: L(
                                    "Continue creating this object now, then create the connections on the other objects you import."
                                 ),
                              },
                              {
                                 maxHeight: uiConfig.xxxLargeSpacer,
                                 hidden: uiConfig.hideMobile,
                              },
                           ],
                        },
                        {
                           id: this.ids.displayConnections,
                           rows: [
                              {
                                 // id: ids.tabFields,
                                 view: "layout",
                                 padding: 10,
                                 rows: [
                                    {
                                       cols: [
                                          {
                                             label: L("Connections"),
                                             view: "label",
                                          },
                                          {
                                             icon: "wxi-plus",
                                             view: "icon",
                                             width: 38,
                                             click: () => {
                                                this._addConnection();
                                             },
                                          },
                                       ],
                                    },
                                    {
                                       view: "scrollview",
                                       scroll: "y",
                                       borderless: true,
                                       padding: 0,
                                       margin: 0,
                                       body: {
                                          id: this.ids.connections,
                                          view: "layout",
                                          padding: 0,
                                          margin: 0,
                                          rows: [],
                                       },
                                    },
                                 ],
                              },
                           ],
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
         this.disable();
      }

      setTable(table) {
         this.table = table;
         $$(this.ids.tableName).setValue(
            `<span style="font-size: 1.5em; font-weight:bold">${this.table}</span>`
         );
      }

      loadConnections(allConnections) {
         this.connectionList = allConnections;
         // refresh more often than on init();
         this.listNetsuiteObjects = this.AB.objects(
            (o) => o.plugin_key == keyPlugin
         );
         if (this.listNetsuiteObjects.length == 0) {
            $$(this.ids.displayNoConnections)?.show();
         } else {
            $$(this.ids.displayConnections)?.show();
         }
      }

      _fieldItem(key, type) {
         const self = this;
         const fieldTypes = this.AB.Class.ABFieldManager.allFields();
         const fieldKeys = ["string", "LongText", "number", "date", "boolean"];

         const L = this.L();

         const linkTypes = ["one:one", "one:many", "many:one", "many:many"];
         const linkOptions = linkTypes.map((l) => {
            return { id: l, value: l };
         });
         linkOptions.unshift({ id: "_choose", value: L("choose link type") });

         // For the Base Object, let's include all fields that are clearly
         // objects.
         let fieldOptions = this.connectionList.map((conn) => {
            return {
               id: conn.column,
               value: conn.column,
            };
         });

         let thisObjectFields = fieldOptions;
         let thatObjectFields = [];

         let listOtherObjects = this.listNetsuiteObjects.map((nObj) => {
            return {
               id: nObj.id,
               value: nObj.label,
            };
         });
         listOtherObjects.unshift({ id: "_choose", value: L("Choose Object") });

         return {
            view: "form",
            elements: [
               {
                  cols: [
                     // object and type
                     {
                        rows: [
                           {
                              placeholder: L("Existing Netsuite Object"),
                              options: listOtherObjects,
                              view: "select",
                              name: "thatObject",
                              label: L("To:"),
                              // value: type,
                              on: {
                                 onChange: async function (
                                    newVal,
                                    oldVal,
                                    config
                                 ) {
                                    let connObj = self.AB.objectByID(newVal);
                                    if (connObj) {
                                       let result = await self.AB.Network.get({
                                          url: `/netsuite/table/${connObj.tableName}`,
                                          params: {
                                             credentials: JSON.stringify(
                                                self.credentials
                                             ),
                                          },
                                       });
                                       let fields = result.filter(
                                          (r) => r.type == "object"
                                       );
                                       let options = fields.map((f) => {
                                          return {
                                             id: f.column,
                                             value: f.column,
                                          };
                                       });

                                       // include a "_that_object_" incase this is a one:xxx
                                       // connection.
                                       // options.unshift({
                                       //    id: "_that_object_",
                                       //    value: L("That Object"),
                                       // });

                                       thatObjectFields = options;
                                       /*
                                       let $linkColumn =
                                          this.getParentView().getChildViews()[1];

                                       $linkColumn.define("options", options);
                                       $linkColumn.refresh();
                                       */
                                       let $rowsFieldsets = this.getParentView()
                                          .getParentView()
                                          .getChildViews()[1];

                                       // update one:one ThatObject:
                                       let whichOptions = $rowsFieldsets
                                          .getChildViews()[0]
                                          .getChildViews()[0]
                                          .getChildViews()[1];
                                       let newOptions = [
                                          { id: "_choose", value: L("Choose") },
                                          {
                                             id: "_this_",
                                             value: L("This Object"),
                                          },
                                       ];
                                       newOptions.push({
                                          id: connObj.id,
                                          value: connObj.label,
                                       });
                                       whichOptions.define(
                                          "options",
                                          newOptions
                                       );
                                       whichOptions.refresh();
                                    }
                                 },
                              },
                           },
                           {
                              placeholder: "Link Type",
                              options: linkOptions,
                              view: "select",
                              name: "linkType",
                              label: L("link type"),
                              on: {
                                 onChange: async function (
                                    newVal,
                                    oldVal,
                                    config
                                 ) {
                                    let $toObj =
                                       this.getParentView().getChildViews()[0];
                                    let $linkColumn =
                                       this.getParentView().getChildViews()[1];

                                    let objID = $toObj.getValue();
                                    let Obj = self.AB.objectByID(objID);

                                    let linkVal = $linkColumn.getValue();
                                    let links = linkVal.split(":");
                                    let messageA = self.message(
                                       L("This object"),
                                       links[0],
                                       Obj.label
                                    );

                                    let messageB = self.message(
                                       Obj.label,
                                       links[1],
                                       L("This object")
                                    );

                                    if (newVal == "_choose") {
                                       messageA = messageB = "";
                                    }

                                    let $linkTextA =
                                       this.getParentView().getChildViews()[2];
                                    let $linkTextB =
                                       this.getParentView().getChildViews()[3];

                                    $linkTextA.define("label", messageA);
                                    $linkTextA.refresh();

                                    $linkTextB.define("label", messageB);
                                    $linkTextB.refresh();

                                    let $rowsFieldsets = this.getParentView()
                                       .getParentView()
                                       .getChildViews()[1];

                                    let $thatFieldOptions;

                                    switch (linkVal) {
                                       case "one:one":
                                          $rowsFieldsets
                                             .getChildViews()[0]
                                             .show();
                                          break;

                                       case "one:many":
                                          // This Object's fields must be in field picker:
                                          $thatFieldOptions = $rowsFieldsets
                                             .getChildViews()[1]
                                             .getChildViews()[0]
                                             .getChildViews()[1];
                                          $thatFieldOptions.define(
                                             "options",
                                             thisObjectFields
                                          );
                                          $thatFieldOptions.refresh();
                                          $rowsFieldsets
                                             .getChildViews()[1]
                                             .show();
                                          break;

                                       case "many:one":
                                          // This Object's fields must be in field picker:
                                          $thatFieldOptions = $rowsFieldsets
                                             .getChildViews()[1]
                                             .getChildViews()[0]
                                             .getChildViews()[1];
                                          $thatFieldOptions.define(
                                             "options",
                                             thatObjectFields
                                          );
                                          $thatFieldOptions.refresh();
                                          $rowsFieldsets
                                             .getChildViews()[1]
                                             .show();
                                          break;

                                       case "many:many":
                                          $rowsFieldsets
                                             .getChildViews()[2]
                                             .show();
                                          break;
                                    }
                                 },
                              },
                              // value: type,
                           },
                           {
                              // this to that
                              // id: ids.fieldLink2,
                              view: "label",
                              // width: 200,
                           },
                           {
                              // that to this
                              view: "label",
                              // width: 200,
                           },
                        ],
                     },
                     {
                        rows: [
                           {
                              view: "fieldset",
                              label: L("one to one"),
                              hidden: true,
                              body: {
                                 rows: [
                                    {
                                       view: "label",
                                       label: L(
                                          "which object holds the connection value?"
                                       ),
                                    },
                                    {
                                       view: "select",
                                       options: [
                                          {
                                             id: "_choose",
                                             value: L("Choose Object"),
                                          },
                                          {
                                             id: "_this_",
                                             value: L("This Object"),
                                          },
                                          {
                                             id: "_that_",
                                             value: L("That Object"),
                                          },
                                       ],
                                       name: "whichSource",
                                       on: {
                                          onChange: async function (
                                             newVal,
                                             oldVal,
                                             config
                                          ) {
                                             if (newVal == "_choose") return;

                                             let $fieldPicker =
                                                this.getParentView().getChildViews()[2];

                                             if (newVal == "_this_") {
                                                $fieldPicker.define(
                                                   "options",
                                                   thisObjectFields
                                                );
                                             } else {
                                                $fieldPicker.define(
                                                   "options",
                                                   thatObjectFields
                                                );
                                             }
                                             $fieldPicker.refresh();
                                             $fieldPicker.show();
                                          },
                                       },
                                    },
                                    {
                                       view: "select",
                                       label: L("which field"),
                                       name: "sourceField",
                                       options: [],
                                       hidden: true,
                                    },
                                 ],
                              },
                           },
                           {
                              view: "fieldset",
                              label: L("one:X"),
                              hidden: true,
                              body: {
                                 rows: [
                                    {
                                       view: "label",
                                       label: L(
                                          "which field defines the connection?"
                                       ),
                                    },
                                    {
                                       view: "select",
                                       // label: L("which field"),
                                       name: "thatField",
                                       options: [],
                                       // hidden: false,
                                    },
                                 ],
                              },
                           },
                           {
                              view: "fieldset",
                              label: L("many:many"),
                              hidden: true,
                              body: {
                                 rows: [
                                    {
                                       view: "label",
                                       label: L(
                                          "which table is the join table?"
                                       ),
                                    },
                                    {
                                       view: "combo",
                                       name: "joinTable",
                                       options: {
                                          filter: (item, value) => {
                                             return (
                                                item.value
                                                   .toLowerCase()
                                                   .indexOf(
                                                      value.toLowerCase()
                                                   ) > -1
                                             );
                                          },
                                          body: {
                                             // template: "#value#",
                                             data: this.allTables,
                                          },
                                       },
                                       on: {
                                          onChange: async function (
                                             newVal,
                                             oldVal,
                                             config
                                          ) {
                                             let result =
                                                await self.AB.Network.get({
                                                   url: `/netsuite/table/${newVal}`,
                                                   params: {
                                                      credentials:
                                                         JSON.stringify(
                                                            self.credentials
                                                         ),
                                                   },
                                                });
                                             // let fields = result.filter(
                                             //    (r) => r.type == "object"
                                             // );
                                             let options = result.map((f) => {
                                                return {
                                                   id: f.column,
                                                   value: f.column,
                                                };
                                             });

                                             let $thisObjRef =
                                                this.getParentView().getChildViews()[2];
                                             $thisObjRef.define(
                                                "options",
                                                options
                                             );
                                             $thisObjRef.refresh();
                                             $thisObjRef.show();

                                             let $thatObjRef =
                                                this.getParentView().getChildViews()[3];
                                             $thatObjRef.define(
                                                "options",
                                                options
                                             );
                                             $thatObjRef.refresh();
                                             $thatObjRef.show();

                                             let $objectPK =
                                                this.getParentView().getChildViews()[4];
                                             $objectPK.define(
                                                "options",
                                                options
                                             );

                                             let pkField = result.find(
                                                (r) => r.title == "Internal ID"
                                             );
                                             if (pkField) {
                                                $objectPK.setValue(
                                                   pkField.column
                                                );
                                             }
                                             $objectPK.refresh();
                                             $objectPK.show();

                                             let $entityField =
                                                this.getParentView().getChildViews()[5];
                                             $entityField.define(
                                                "options",
                                                options
                                             );

                                             let fieldEntity = result.find(
                                                (r) => {
                                                   if (!r.column) return false;

                                                   return (
                                                      r.column.indexOf(
                                                         "entity"
                                                      ) > -1
                                                   );
                                                }
                                             );
                                             if (fieldEntity) {
                                                $entityField.setValue(
                                                   fieldEntity.column
                                                );
                                             }
                                             $entityField.refresh();
                                             $entityField.show();

                                             let fOptions =
                                                self.AB.cloneDeep(options);
                                             fOptions.unshift({
                                                id: "_none_",
                                                value: "",
                                             });
                                             let $activeField =
                                                this.getParentView().getChildViews()[6];
                                             $activeField.define(
                                                "options",
                                                fOptions
                                             );
                                             $activeField.refresh();
                                             $activeField.show();
                                          },
                                       },
                                    },

                                    {
                                       view: "select",
                                       label: L("This Object's reference"),
                                       labelPosition: "top",
                                       options: [],
                                       name: "thisObjReference",
                                       hidden: true,
                                    },
                                    {
                                       view: "select",
                                       label: L("That Object's reference"),
                                       labelPosition: "top",
                                       options: [],
                                       name: "thatObjReference",
                                       hidden: true,
                                    },
                                    {
                                       view: "select",
                                       label: L("Join Table Primary Key:"),
                                       labelPosition: "top",
                                       options: [],
                                       name: "joinTablePK",
                                       hidden: true,
                                    },
                                    {
                                       view: "select",
                                       label: L(
                                          "Which field holds the Entity:"
                                       ),
                                       labelPosition: "top",
                                       options: [],
                                       name: "joinTableEntity",
                                       hidden: true,
                                    },
                                    {
                                       view: "select",
                                       label: L("Join Table isActive Field:"),
                                       labelPosition: "top",
                                       options: [],
                                       name: "joinActiveField",
                                       hidden: true,
                                       on: {
                                          onChange: async function (
                                             newVal,
                                             oldVal,
                                             config
                                          ) {
                                             if (newVal != "_none_") {
                                                // show the active/inactive value
                                                let siblings =
                                                   this.getParentView().getChildViews();
                                                siblings[
                                                   siblings.length - 2
                                                ].show();
                                                siblings[
                                                   siblings.length - 1
                                                ].show();
                                             }
                                          },
                                       },
                                    },
                                    {
                                       view: "text",
                                       label: L("Active Value"),
                                       name: "joinActiveValue",
                                       hidden: true,
                                       value: "",
                                    },
                                    {
                                       view: "text",
                                       label: L("InActive Value"),
                                       name: "joinInActiveValue",
                                       hidden: true,
                                       value: "",
                                    },
                                 ],
                              },
                           },
                        ],
                     },
                     {
                        // Delete Column
                        rows: [
                           {},
                           {
                              icon: "wxi-trash",
                              view: "icon",
                              width: 38,
                              click: function () {
                                 const $item = this.getParentView()
                                    .getParentView()
                                    .getParentView();
                                 $$(self.ids.connections).removeView($item);
                              },
                           },
                           {},
                        ],
                        // delete Row Icon
                     },
                  ],
               },
            ],
         };
      }

      _addConnection(key, type) {
         const uiItem = this._fieldItem(key, type);
         $$(this.ids.connections).addView(uiItem);
      }

      _clearFieldItems() {
         const $connections = $$(this.ids.connections);
         AB.Webix.ui([], $connections);
      }

      message(a, link, b) {
         let L = this.L();

         let msg;
         if (link == "many") {
            msg = L("{0} has many {1} entities", [a, b]);
         } else {
            msg = L("{0} has one {1} entity", [a, b]);
         }

         return msg;
      }

      ready() {
         $$(this.ids.buttonVerify).enable();
      }

      setCredentials(creds) {
         this.credentials = creds;
      }

      setAllTables(tables) {
         let L = this.L();
         this.allTables = this.AB.cloneDeep(tables);
         this.allTables.unshift({ id: "_choose", value: L("Choose") });
      }

      getValues() {
         let values = [];
         $$(this.ids.connections)
            .getChildViews()
            .forEach(($row) => {
               values.push($row.getValues());
            });
         return values;
      }
   }

   return new UIConnections();
}
