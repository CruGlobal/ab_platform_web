const ABViewDetailItemComponent = require("./ABViewDetailItemComponent");

module.exports = class ABViewDetailTreeComponent extends (
   ABViewDetailItemComponent
) {
   constructor(baseView, idBase, ids) {
      super(baseView, idBase || `ABViewDetailTree_${baseView.id}`, ids);
   }

   get className() {
      return "ab-detail-tree";
   }

   async init(AB) {
      await super.init(AB);

      // add div of tree to detail
      this.setValue(`<div class="${this.className}"></div>`);
   }

   getDomTree() {
      const $detailItem = $$(this.ids.detailItem);

      if (!$detailItem) return;

      return $detailItem.$view.getElementsByClassName(this.className)[0];
   }

   setValue(val) {
      // convert value to array
      let vals = [];

      if (Array.isArray(val)) {
         vals = val;
      } else if (val) {
         // if it is the initial html string, then just set it and return
         if (typeof val == "string" && val.indexOf(this.className) > -1) {
            super.setValue(val);
            return;
         }

         try {
            const parsed = JSON.parse(val);

            if (Array.isArray(parsed)) {
               vals = parsed;
            } else {
               vals.push(parsed);
            }
         } catch (e) {
            if (typeof val == "string")
               vals = val.split(",").filter((v) => v !== "");
            else vals.push(val);
         }

         // Normalize all entries to IDs
         vals = vals.map((v) =>
            v && typeof v === "object" && v.id ? v.id : v
         );
      }

      setTimeout(() => {
         // get tree dom
         const domTree = this.getDomTree();

         if (!domTree) return false;

         const field = this.view.field();
         const branches = [];

         let selectOptions = this.AB.cloneDeep(field.settings.options);

         selectOptions = new this.AB.Webix.TreeCollection({
            data: selectOptions,
         });

         selectOptions.data.each(function (obj) {
            if (vals.some((v) => v == obj.id)) {
               let html = "";
               let rootid = obj.id;

               while (selectOptions.data.getParentId(rootid)) {
                  selectOptions.data.each(function (par) {
                     if (selectOptions.data.getParentId(rootid) === par.id) {
                        html = `${par.text}: ${html}`;
                     }
                  });

                  rootid = selectOptions.data.getParentId(rootid);
               }

               html += obj.text;
               branches.push(html);
            }
         });

         const myHex = "#4CAF50";

         let nodeHTML = "<div class='list-data-values'>";

         branches.forEach(function (item) {
            nodeHTML += `<span class="selectivity-multiple-selected-item rendered" style="background-color: ${myHex} !important;">${item}</span>`;
         });

         nodeHTML += "</div>";
         domTree.innerHTML = nodeHTML;

         let height = 33;

         if (domTree.scrollHeight > 33) height = domTree.scrollHeight;

         const $detailItem = $$(this.ids.detailItem);

         $detailItem.config.height = height;
         $detailItem.resize();
      }, 50);
   }
};
