const ABFieldTreeCore = require("../../core/dataFields/ABFieldTreeCore");

const L = (...params) => AB.Multilingual.label(...params);

/** Hex colour used for selected-item tags */
const TAG_COLOR = "#4CAF50";

module.exports = class ABFieldTree extends ABFieldTreeCore {
   // constructor(values, object) {
   //    super(values, object);
   // }

   ///
   /// Instance Methods
   ///

   // isValid() {
   //    const validator = super.isValid();

   //    // validator.addError('columnName', L('ab.validation.object.name.unique', 'Field columnName must be unique (#name# already used in this Application)').replace('#name#', this.name) );\

   //    return validator;
   // }

   ///
   /// Working with Actual Object Values:
   ///

   idCustomContainer(obj) {
      return `${this.columnName.replace(/ /g, "_")}-${obj.id}-tree`;
   }

   /**
    * Build an array of human-readable branch label strings for the
    * given list of selected item ids, walking up the tree collection
    * to prepend ancestor labels.
    *
    * @param {webix.TreeCollection} treeCollection
    * @param {Array<string|number>} selectedIds
    * @returns {string[]}
    */
   _buildBranchLabels(treeCollection, selectedIds) {
      const labels = [];

      treeCollection.data.each(function (item) {
         if (
            typeof selectedIds.indexOf !== "undefined" &&
            selectedIds.indexOf(item.id) !== -1
         ) {
            let labelText = "";
            let ancestorId = item.id;

            while (this.getParentId(ancestorId)) {
               treeCollection.data.each(function (candidate) {
                  if (
                     treeCollection.data.getParentId(ancestorId) ===
                     candidate.id
                  ) {
                     labelText = `${candidate.text}: ${labelText}`;
                  }
               });
               ancestorId = this.getParentId(ancestorId);
            }

            labelText += item.text;
            labels.push(labelText);
         }
      });

      return labels;
   }

   /**
    * Build the inner HTML string that renders selected-item tags.
    *
    * @param {string[]} labels     - Branch label strings to display
    * @param {string}   cssClass   - Extra CSS class on the wrapper div
    * @param {string}   [placeholder] - HTML shown when labels is empty
    * @returns {string}
    */
   _renderTagsHtml(labels, cssClass, placeholder = "") {
      const wrapperClass = `list-data-values${cssClass ? ` ${cssClass}` : ""}`;
      let html = `<div class='${wrapperClass}'>`;

      if (labels.length === 0) {
         html += placeholder;
      } else {
         labels.forEach((label) => {
            html +=
               `<span class="selectivity-multiple-selected-item rendered" ` +
               `style="background-color:${TAG_COLOR} !important;">` +
               label +
               `</span>`;
         });
      }

      html += "</div>";
      return html;
   }

   // return the grid column header definition for this instance of ABFieldTree
   columnHeader(options) {
      options = options || {};

      const config = super.columnHeader(options);
      const field = this;

      const isForm = options.isForm;
      const indentWidth = options.width;

      const emptyPlaceholder = isForm
         ? `<span style='color: #CCC; padding: 0 5px;'>${L(
              "Select items"
           )}</span>`
         : "";

      config.template = (row) => {
         if (row.$group) return row[field.columnName];

         const treeCollection = new webix.TreeCollection({
            data: field.AB.cloneDeep(field.settings.options),
         });

         const selectedIds =
            row[field.columnName] != null ? row[field.columnName] : row;

         const labels = field._buildBranchLabels(treeCollection, selectedIds);
         const tagsHtml = field._renderTagsHtml(labels, "", emptyPlaceholder);

         if (indentWidth) {
            return (
               `<div style="margin-left: ${indentWidth}px;" ` +
               `class="list-data-values${isForm ? " form-entry" : ""}">` +
               tagsHtml +
               `</div>`
            );
         }

         return (
            `<div class="list-data-values${isForm ? " form-entry" : ""}">` +
            tagsHtml +
            `</div>`
         );
      };

      return config;
   }

   /*
    * @function customDisplay
    * perform any custom display modifications for this field.
    * @param {object} row is the {name=>value} hash of the current row of data.
    * @param {App} App the shared ui App object useful more making globally
    *                  unique id references.
    * @param {HtmlDOM} node  the HTML Dom object for this field's display.
    */
   customDisplay(row, App, node, options) {
      // sanity check.
      if (!node) return;

      options = options || {};

      const field = this;

      if (options.isForm) {
         if (!row || row.length === 0) {
            node.innerHTML =
               `<div class='list-data-values form-entry'>` +
               `<span style='color: #CCC; padding: 0 5px;'>${L(
                  "Select items"
               )}</span>` +
               `</div>`;
            return;
         }

         const treeCollection = new webix.TreeCollection({
            data: field.AB.cloneDeep(field.settings.options),
         });

         const selectedIds =
            row[field.columnName] != null ? row[field.columnName] : row;

         const labels = field._buildBranchLabels(treeCollection, selectedIds);
         node.innerHTML = field._renderTagsHtml(labels, "form-entry");
      }

      field.setBadge(node, row);
   }

   /*
    * @function customEdit
    *
    * @param {object} row is the {name=>value} hash of the current row of data.
    * @param {App} App the shared ui App object useful more making globally
    *                  unique id references.
    * @param {HtmlDOM} node  the HTML Dom object for this field's display.
    */
   customEdit(row, App, node, component) {
      // Normalise arguments: (row, node, component) when App is not an App instance
      if (App && typeof App === "object" && typeof App.unique !== "function") {
         component = node;
         node = App;
         App = null;
      }

      const idBase =
         App && typeof App.unique === "function"
            ? App.unique(this.idCustomContainer(row))
            : this.idCustomContainer(row);

      const idPopup = `${idBase}-popup`;
      const idTree = `${idBase}-tree`;

      const gridView = $$(node);
      const field = this;
      const formComponent = component;

      let activeRow = row;

      // ── Helpers ──────────────────────────────────────────────────────────

      /**
       * Normalise a raw column value into an array of strings.
       * Handles: Array, JSON string, comma-separated string, scalar.
       */
      function normaliseToArray(raw) {
         if (raw == null || raw === "") return [];
         if (Array.isArray(raw)) return raw.map(String);
         if (typeof raw === "string") {
            try {
               const parsed = JSON.parse(raw);
               if (Array.isArray(parsed)) return parsed.map(String);
               return [String(parsed)];
            } catch {
               return raw
                  .split(",")
                  .filter((v) => v !== "")
                  .map(String);
            }
         }
         return [String(raw)];
      }

      /**
       * Tick the checkboxes in the Webix tree that match the ids stored in
       * `rowData`.  Must be called after the tree DOM is rendered.
       */
      function applyCheckedItems(rowData) {
         const $tree = $$(idTree);
         if (!$tree) return;

         const selectedIds = normaliseToArray(rowData[field.columnName]);

         $tree.blockEvent();
         $tree.uncheckAll();

         selectedIds.forEach((id) => {
            // Webix ids may be stored as strings or numbers — try both.
            let resolvedId = id;
            if (!$tree.exists(resolvedId)) resolvedId = String(id);
            if (!$tree.exists(resolvedId) && !isNaN(id))
               resolvedId = Number(id);

            if ($tree.exists(resolvedId)) {
               $tree.checkItem(resolvedId);
            }
         });

         $tree.unblockEvent();
      }

      /**
       * Re-load the tree with fresh option data, open all nodes, then
       * apply saved check-marks after Webix finishes rendering (50 ms).
       */
      function refreshTree(rowData) {
         const $tree = $$(idTree);
         if (!$tree) return;

         const treeData = field.AB.cloneDeep(field.settings.options);
         $tree.clearAll();
         $tree.parse(treeData);
         $tree.openAll();

         setTimeout(() => applyCheckedItems(rowData), 50);
      }

      // ── Open popup ───────────────────────────────────────────────────────

      if ($$(idPopup)) {
         activeRow = row;
         $$(idPopup).show(node, { x: -7 });
         refreshTree(activeRow);
         return false;
      }

      // ── Create popup (first open) ─────────────────────────────────────────

      webix
         .ui({
            id: idPopup,
            view: "popup",
            width: 500,
            height: 400,
            body: {
               id: idTree,
               view: "tree",
               css: "ab-data-tree",
               template(treeItem, common) {
                  return (
                     "<label>" +
                     common.checkbox(treeItem, common) +
                     `&nbsp;${treeItem.text}` +
                     "</label>"
                  );
               },
               on: {
                  /**
                   * Fired when a tree checkbox is toggled.
                   * Rules:
                   *  - Checking a child → uncheck its ancestors (parent+child
                   *    together would be redundant).
                   *  - Checking a root  → uncheck all its descendants.
                   *  - Cross-branch selections are unrestricted.
                   */
                  onItemCheck: async function onItemCheck(
                     checkedId,
                     isChecked
                  ) {
                     const $tree = this;
                     const itemNode = $tree.getItemNode(checkedId);

                     // Update visual "selected" highlight
                     if (itemNode) {
                        itemNode.classList.toggle("selected", isChecked);
                     }

                     // Enforce parent ↔ child exclusivity within the same branch
                     $tree.blockEvent();

                     if (isChecked && $tree.getParentId(checkedId)) {
                        // Child checked → uncheck all its ancestors
                        let parentId = $tree.getParentId(checkedId);
                        while (parentId) {
                           $tree.uncheckItem(parentId);
                           parentId = $tree.getParentId(parentId);
                        }
                     } else if (isChecked && !$tree.getParentId(checkedId)) {
                        // Root checked → uncheck all descendants
                        $tree.data.eachSubItem(checkedId, (child) => {
                           $tree.uncheckItem(child.id);
                        });
                     }

                     $tree.unblockEvent();

                     // Build payload from currently checked ids
                     const checkedIds = ($$(idTree).getChecked() || []).map(
                        String
                     );
                     const columnValue =
                        checkedIds.length === 0 ? null : checkedIds;

                     // Sync activeRow so re-opening the popup shows current state
                     activeRow[field.columnName] = columnValue;

                     if (activeRow.id) {
                        // ── Grid / existing record ───────────────────────
                        const payload = { [field.columnName]: columnValue };

                        try {
                           await field.object
                              .model()
                              .update(activeRow.id, payload);

                           if (gridView && gridView.updateItem) {
                              gridView.updateItem(activeRow.id, payload);
                           }
                        } catch (err) {
                           node.classList.add(
                              "webix_invalid",
                              "webix_invalid_cell"
                           );

                           field.AB.notify.developer(err, {
                              message:
                                 "ABFieldTree:onItemCheck(): Error updating entry.",
                              row: activeRow,
                              payload,
                           });
                        }
                     } else {
                        // ── Form / new record ─────────────────────────────
                        field.setValue($$(formComponent.ids.formItem), {
                           [field.columnName]: checkedIds,
                        });
                     }
                  },
               },
            },
         })
         .show(node, { x: -7 });

      refreshTree(activeRow);
      return false;
   }

   setBadge(domNode, row) {
      const field = this;
      const listNode = domNode.querySelector(".list-data-values");
      if (!listNode) return;

      const innerHeight = listNode.scrollHeight;
      const outerHeight = listNode.parentElement.clientHeight;

      if (innerHeight - outerHeight <= 5) return;

      const selectedCount =
         row[field.columnName] && row[field.columnName].length
            ? row[field.columnName].length
            : 0;

      if (selectedCount <= 1) return;

      const existingBadge = listNode.querySelector(
         ".webix_badge.selectivityBadge"
      );
      if (existingBadge) {
         existingBadge.innerHTML = selectedCount;
         return;
      }

      // Create badge anchor + span
      const anchor = document.createElement("a");
      anchor.href = "javascript:void(0);";
      anchor.addEventListener("click", (event) => {
         event.stopPropagation();
      });

      const badgeSpan = document.createElement("span");
      badgeSpan.classList.add("webix_badge", "selectivityBadge");
      badgeSpan.textContent = selectedCount;

      anchor.appendChild(badgeSpan);
      listNode.appendChild(anchor);
   }

   /*
    * @function formComponent
    * returns a drag and droppable component that is used on the UI
    * interface builder to place form components related to this ABField.
    *
    * an ABField defines which form component is used to edit it's contents.
    * However, what is returned here, needs to be able to create an instance of
    * the component that will be stored with the ABViewForm.
    */
   formComponent() {
      return super.formComponent("formtree");
   }

   detailComponent() {
      const detailComponentSetting = super.detailComponent();

      detailComponentSetting.common = () => ({
         key: "detailtree",
      });

      return detailComponentSetting;
   }

   getValue(item) {
      if (!item) return {};
      if (typeof item.getValues === "function") return item.getValues();
      if (typeof item.getValue === "function") return item.getValue();
      return {};
   }

   setValue(item, rowData) {
      if (!item) return false;

      const val = rowData[this.columnName] || [];

      if (typeof item.setValues === "function") {
         item.setValues(val);
      } else if (typeof item.setValue === "function") {
         item.setValue(val);
      }

      const listNode = item.$view.querySelector(".list-data-values");
      if (!listNode) return false;

      this.customDisplay(val, this.App, listNode, {
         editable: true,
         isForm: true,
      });

      setTimeout(() => {
         const height = listNode.scrollHeight > 33 ? listNode.scrollHeight : 33;
         item.config.height = height + 5;
         item.resize();
      }, 200);
   }
};
