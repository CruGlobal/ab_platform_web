const KeysCredentials = [
   "NETSUITE_CONSUMER_KEY",
   "NETSUITE_CONSUMER_SECRET",
   "NETSUITE_TOKEN_KEY",
   "NETSUITE_TOKEN_SECRET",
];
const KeysAPI = [
   "NETSUITE_REALM",
   "NETSUITE_BASE_URL",
   "NETSUITE_QUERY_BASE_URL",
];

const KeysALL = KeysCredentials.concat(KeysAPI);

export default function FNUICredentials(AB, base, ABUIPlugin) {
   let this_base = `${base}-credentials`;
   class UICredentials extends ABUIPlugin {
      constructor() {
         super(
            this_base,
            {
               form: "",
               buttonVerify: "",
               labelVerified: "",
            },
            AB
         );

         this.entries = {};
      }
      static getPluginKey() {
         return "ui-credentials";
      }

      ui() {
         let L = this.L();

         // Our webix UI definition:
         let ui = {
            id: this.ids.component,
            header: L("Credentials"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 820,
               height: 700,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  {
                     rows: [],
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
                  {
                     cols: [
                        { fillspace: true },
                        {
                           id: this.ids.labelVerified,
                           view: "label",
                           label: L(
                              "All parameters are valid. Continue on to select a Table to work with."
                           ),
                           hidden: true,
                        },
                     ],
                  },
               ],
            },
         };

         let rows = ui.body.elements[0].rows;
         let fsOauth = {
            view: "fieldset",
            label: L("Netsuite OAuth 1.0 Credentials"),
            body: {
               rows: [],
            },
         };

         let EnvInput = (k) => {
            return {
               cols: [
                  {
                     id: k,
                     view: "text",
                     label: k,
                     name: k,
                     required: true,
                     placeholder: `ENV:${k}`,
                     value: `ENV:${k}`,
                     labelWidth: 230,
                     on: {
                        onChange: (nV /*, oV*/) => {
                           this.envVerify(k, nV);
                        },
                     },
                  },
                  {
                     id: `${k}_verified`,
                     view: "label",
                     width: 20,
                     label: '<i class="fa-solid fa-check"></i>',
                     hidden: true,
                  },
               ],
            };
         };

         KeysCredentials.forEach((k) => {
            fsOauth.body.rows.push(EnvInput(k));
         });
         rows.push(fsOauth);
         rows.push({ height: 15 });

         let fsAPI = {
            view: "fieldset",
            label: L("Netsuite API Config"),
            body: {
               rows: [],
            },
         };

         KeysAPI.forEach((k) => {
            fsAPI.body.rows.push(EnvInput(k));
         });
         rows.push(fsAPI);

         return ui;
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         AB.Webix.extend(this.$form, webix.ProgressBar);
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();

         KeysALL.forEach((k) => {
            $$(k).setValue(`ENV:${k}`);
         });
      }

      getValues() {
         return this.credentials();
      }

      credentials() {
         let creds = {};
         KeysALL.forEach((k) => {
            let $input = $$(k);
            if ($input) {
               creds[k] = $input.getValue();
            }
         });

         return creds;
      }

      envVerify(k, nV) {
         let envKey = nV.replace("ENV:", "");
         return this.AB.Network.get({
            url: `/env/verify/${envKey}`,
         })
            .then((result) => {
               // console.log(result);
               if (result.status == "success") {
                  $$(`${k}_verified`).show();
                  this.entries[k] = true;
               } else {
                  $$(`${k}_verified`).hide();
                  this.entries[k] = false;
               }
            })
            .catch((err) => {
               console.error(err);
               $$(`${k}_verified`).hide();
               this.entries[k] = false;
            });
      }

      async verify() {
         let isVerified = true;
         let AllVerifies = [];
         KeysALL.forEach((k) => {
            let nV = $$(k).getValue();
            AllVerifies.push(this.envVerify(k, nV));
         });
         await Promise.all(AllVerifies);

         KeysALL.forEach((k) => {
            isVerified = isVerified && this.entries[k];
         });

         if (isVerified) {
            this.emit("verified");
            $$(this.ids.labelVerified)?.show();
         } else {
            this.emit("notverified");
            $$(this.ids.labelVerified)?.hide();
         }
      }
   }

   return new UICredentials();
}
