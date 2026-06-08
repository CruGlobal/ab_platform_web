const ABViewForm = require("./ABViewForm");

const ABViewFormURLDefaults = {
   key: "form-url", // unique key identifier for this ABViewForm
   icon: "list-alt", // icon reference: (without 'fa-' )
   labelKey: "FormUrl", // {string} the multilingual label key for the class label
};

module.exports = class ABViewFormURL extends ABViewForm {
   static common() {
      return ABViewFormURLDefaults;
   }

   async submitValues(formVals) {
      let url = this.settings.url;
      let method = this.settings.method || "get";
      method = method.toLowerCase();
      if (!["get", "post", "put", "delete"].includes(method)) {
         throw new Error(
            `Invalid method "${method}" specified for ABViewFormURL`
         );
      }

      // remove empty id from formVals
      if (formVals.id === "") {
         delete formVals.id;
      }

      let params = {
         data: formVals,
         url,
      };

      if (this.settings.headers) {
         params.headers = this.settings.headers;
      }

      return await this.AB.Network[method](params);
   }
};
