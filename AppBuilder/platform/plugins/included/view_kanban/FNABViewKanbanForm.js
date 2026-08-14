/**
 * Kanban sidebar detached form: save button only.
 * No cross-folder imports — bases come from pluginAPI (see ABClassManager.getPluginAPI).
 */

export default function createABViewKanbanDetachedFormSave({
   AB,
   ABViewPlugin,
   ABViewComponentPlugin,
}) {

   const ABViewFormButtonPropertyComponentDefaults = {
      includeSave: true,
      saveLabel: "",
      includeCancel: false,
      cancelLabel: "",
      includeReset: false,
      resetLabel: "",
      includeDelete: false,
      deleteLabel: "",
      afterCancel: null,
      alignment: "right",
      isDefault: false, // mark default button of form widget
   };


   class ABViewFormButtonCore extends ABViewPlugin {
      static common() {
         return {
            key: "button",
            // {string} unique key for this view

            icon: "square",
            // {string} fa-[icon] reference for this view

            labelKey: "ab.components.button",
            // {string} the multilingual label key for the class label
         };
      }
      constructor(values, application, parent, defaultValues) {
         const ABViewFormButtonDefaults = {
            key: "button",
            // {string} unique key for this view

            icon: "square",
            // {string} fa-[icon] reference for this view

            labelKey: "ab.components.button",
            // {string} the multilingual label key for the class label
         };
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormButtonDefaults
         )
      }


      static defaultValues() {
         return ABViewFormButtonPropertyComponentDefaults;
      }

      ///
      /// Instance Methods
      ///

      toObj() {
         // labels are multilingual values:
         let labels = [];

         if (this.settings.saveLabel) labels.push("saveLabel");

         if (this.settings.cancelLabel) labels.push("cancelLabel");

         if (this.settings.resetLabel) labels.push("resetLabel");

         if (this.settings.deleteLabel) labels.push("deleteLabel");

         this.unTranslate(this.settings, this.settings, labels);

         let result = super.toObj();

         return result;
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

      fromValues(values) {
         super.fromValues(values);

         // labels are multilingual values:
         let labels = [];

         if (this.settings.saveLabel) labels.push("saveLabel");

         if (this.settings.cancelLabel) labels.push("cancelLabel");

         if (this.settings.resetLabel) labels.push("resetLabel");

         if (this.settings.deleteLabel) labels.push("deleteLabel");

         this.unTranslate(this.settings, this.settings, labels);

         // this.settings.includeSave = JSON.parse(
         //    (this.settings?.includeSave ?? true) &&
         //    ABViewFormButtonPropertyComponentDefaults.includeSave
         // );
         // this.settings.includeCancel = JSON.parse(
         //    this.settings.includeCancel ||
         //    ABViewFormButtonPropertyComponentDefaults.includeCancel
         // );
         // this.settings.includeReset = JSON.parse(
         //    this.settings.includeReset ||
         //    ABViewFormButtonPropertyComponentDefaults.includeReset
         // );
         // this.settings.includeDelete = JSON.parse(
         //    this.settings.includeDelete ||
         //    ABViewFormButtonPropertyComponentDefaults.includeDelete
         // );

         // this.settings.isDefault = JSON.parse(
         //    this.settings.isDefault ||
         //    ABViewFormButtonPropertyComponentDefaults.isDefault
         // );
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   }

   class formComponent extends ABViewComponentPlugin {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewFormItem_${baseView.id}`,
            Object.assign({ formItem: "" }, ids)
         );
      }

      ui(uiFormItemComponent = {}) {
         // setup 'label' of the element
         const baseView = this.view;
         const form = baseView.parentFormComponent(),
            field = baseView.field?.() || null,
            label = "";
         const settings = form?.settings || {};
         const _uiFormItem = {
            id: this.ids.formItem,
            labelPosition: settings.labelPosition,
            labelWidth: settings.labelWidth,
            label,
         };

         if (field) {
            _uiFormItem.name = field.columnName;

            // default value
            const data = {};

            field.defaultValue(data);

            if (data[field.columnName]) _uiFormItem.value = data[field.columnName];

            if (settings.showLabel) _uiFormItem.label = field.label;

            if (field.settings.required || baseView.settings?.required)
               _uiFormItem.required = 1;

            if (baseView.settings?.disable === 1) _uiFormItem.disabled = true;

            // this may be needed if we want to format data at this point
            // if (field.format) data = field.format(data);

            _uiFormItem.validate = (val, data, colName) => {
               const validator = AB.Validation.validator();

               field.isValidData(data, validator);

               return validator.pass();
            };
         }

         const _ui = super.ui([
            Object.assign({}, _uiFormItem, uiFormItemComponent),
         ]);

         delete _ui.type;

         return _ui;
      }
   };


   class ABViewKanbanDetachedFormSaveComponent extends formComponent {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewKanbanDetachedFormSave_${baseView.id}`,
            ids
         );
      }

      ui() {
         const self = this;
         const baseView = this.view;
         const form = baseView.parentFormComponent();
         const settings = baseView.settings ?? {};
         const alignment =
            settings.alignment ||
            baseView.constructor.defaultValues().alignment;

         const _ui = { cols: [] };

         if (alignment === "center" || alignment === "right") {
            _ui.cols.push({});
         }

         if (settings.includeSave) {
            _ui.cols.push({
               view: "button",
               type: "form",
               css: "webix_primary",
               autowidth: true,
               value: settings.saveLabel || this.label("Save"),
               click: function () {
                  self.onSave(this);
               },
               on: {
                  onAfterRender: function () {
                     this.getInputNode().setAttribute(
                        "data-cy",
                        `button save ${form.id}`
                     );
                  },
               },
            });
         }

         if (alignment === "center" || alignment === "left") {
            _ui.cols.push({});
         }

         return super.ui(_ui);
      }

      onSave(saveButton) {
         if (!saveButton) {
            console.error("Require the button element");
            return;
         }
         const form = this.view.parentFormComponent();
         const formView = saveButton.getFormView();

         saveButton.disable?.();

         form
            .saveData(formView)
            .then(() => {
               saveButton.enable?.();
               form.focusOnFirst();
            })
            .catch((err) => {
               console.error(err);
               try {
                  saveButton.enable?.();
               } catch (e) {
                  AB.notify.developer(e, {
                     context:
                        "ABViewKanbanDetachedFormSave.onSave > saveButton.enable()",
                     buttonID: this?.view?.id,
                     formID: this?.view?.parent?.id,
                  });
               }
            });
      }
   }

   return class ABViewKanbanDetachedFormSave extends ABViewFormButtonCore {
      component() {
         return new ABViewKanbanDetachedFormSaveComponent(this);
      }
   };
}
