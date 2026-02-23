import FNAbviewformComponent from "./FNAbviewformComponent.js";


// FNAbviewform Web
// A web side import for an ABView.
//
export default function FNAbviewform({
   /*AB,*/
   ABViewPlugin,
   ABViewComponentPlugin,
   ABViewContainer
}) {
   const ABAbviewformComponent = FNAbviewformComponent({ ABViewComponentPlugin });

   const ABRecordRule = require("../../../../rules/ABViewRuleListFormRecordRules");
   const ABSubmitRule = require("../../../../rules/ABViewRuleListFormSubmitRules");

   const ABViewFormDefaults = {
      key: "form", // unique key identifier for this ABViewForm
      icon: "list-alt", // icon reference: (without 'fa-' )
      labelKey: "Form(plugin)", // {string} the multilingual label key for the class label
   };

   const ABViewFormPropertyComponentDefaults = {
      dataviewID: null,
      showLabel: true,
      labelPosition: "left",
      labelWidth: 120,
      height: 200,
      clearOnLoad: false,
      clearOnSave: false,
      displayRules: [],
      editForm: "none", // The url pointer of ABViewForm

      //	[{
      //		action: {string},
      //		when: [
      //			{
      //				fieldId: {UUID},
      //				comparer: {string},
      //				value: {string}
      //			}
      //		],
      //		values: [
      //			{
      //				fieldId: {UUID},
      //				value: {object}
      //			}
      //		]
      //	}]
      recordRules: [],

      //	[{
      //		action: {string},
      //		when: [
      //			{
      //				fieldId: {UUID},
      //				comparer: {string},
      //				value: {string}
      //			}
      //		],
      //		value: {string}
      //	}]
      submitRules: [],
   };

   class ABViewFormCore extends ABViewContainer {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewFormDefaults);
         this.isForm = true;
      }

      static common() {
         return ABViewFormDefaults;
      }

      static defaultValues() {
         return ABViewFormPropertyComponentDefaults;
      }

      ///
      /// Instance Methods
      ///

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         this.settings.labelPosition =
            this.settings.labelPosition ||
            ABViewFormPropertyComponentDefaults.labelPosition;

         // convert from "0" => true/false
         this.settings.showLabel = JSON.parse(
            this.settings.showLabel != null
               ? this.settings.showLabel
               : ABViewFormPropertyComponentDefaults.showLabel
         );
         this.settings.clearOnLoad = JSON.parse(
            this.settings.clearOnLoad != null
               ? this.settings.clearOnLoad
               : ABViewFormPropertyComponentDefaults.clearOnLoad
         );
         this.settings.clearOnSave = JSON.parse(
            this.settings.clearOnSave != null
               ? this.settings.clearOnSave
               : ABViewFormPropertyComponentDefaults.clearOnSave
         );

         // convert from "0" => 0
         this.settings.labelWidth = parseInt(
            this.settings.labelWidth == null
               ? ABViewFormPropertyComponentDefaults.labelWidth
               : this.settings.labelWidth
         );
         this.settings.height = parseInt(
            this.settings.height == null
               ? ABViewFormPropertyComponentDefaults.height
               : this.settings.height
         );
      }

      // Use this function in kanban
      objectLoad(object) {
         this._currentObject = object;
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         var viewsToAllow = ["label", "layout", "button", "text"],
            allComponents = this.application.viewAll();

         return allComponents.filter((c) => {
            return viewsToAllow.indexOf(c.common().key) > -1;
         });
      }

      /**
       * @method fieldComponents()
       *
       * return an array of all the ABViewFormField children
       *
       * @param {fn} filter  	a filter fn to return a set of ABViewFormField that this fn
       *						returns true for.
       * @return {array} 	array of ABViewFormField
       */
      fieldComponents(filter) {
         const flattenComponents = (views) => {
            let components = [];

            views.forEach((v) => {
               if (v == null) return;

               components.push(v);

               if (v._views?.length) {
                  components = components.concat(flattenComponents(v._views));
               }
            });

            return components;
         };

         if (this._views?.length) {
            const allComponents = flattenComponents(this._views);

            if (filter == null) {
               filter = (comp) => comp?.key?.startsWith("form");
            }

            return allComponents.filter(filter);
         } else {
            return [];
         }
      }

      addFieldToForm(field, yPosition) {
         if (field == null) return;

         var fieldComponent = field.formComponent();
         if (fieldComponent == null) return;

         var newView = fieldComponent.newInstance(this.application, this);
         if (newView == null) return;

         // set settings to component
         newView.settings = newView.settings || {};
         newView.settings.fieldId = field.id;
         // TODO : Default settings

         if (yPosition != null) newView.position.y = yPosition;

         // add a new component
         this._views.push(newView);

         return newView;
      }

      get RecordRule() {
         let object = this.datacollection.datasource;

         if (this._recordRule == null) {
            this._recordRule = new ABRecordRule();
         }

         this._recordRule.formLoad(this);
         this._recordRule.fromSettings(this.settings.recordRules);
         this._recordRule.objectLoad(object);

         return this._recordRule;
      }

      doRecordRulesPre(rowData) {
         return this.RecordRule.processPre({ data: rowData, form: this });
      }

      doRecordRules(rowData) {
         // validate for record rules
         if (rowData) {
            let object = this.datacollection.datasource;
            let ruleValidator = object.isValidData(rowData);
            let isUpdatedDataValid = ruleValidator.pass();
            if (!isUpdatedDataValid) {
               console.error("Updated data is invalid.", { rowData: rowData });
               return Promise.reject(new Error("Updated data is invalid."));
            }
         }

         return this.RecordRule.process({ data: rowData, form: this });
      }

      doSubmitRules(rowData) {
         var object = this.datacollection.datasource;

         var SubmitRules = new ABSubmitRule();
         SubmitRules.formLoad(this);
         SubmitRules.fromSettings(this.settings.submitRules);
         SubmitRules.objectLoad(object);

         return SubmitRules.process({ data: rowData, form: this });
      }
   };

   // const L = (...params) => AB.Multilingual.label(...params);

   // const ABRecordRule = require("../../rules/ABViewRuleListFormRecordRules");
   // const ABSubmitRule = require("../../rules/ABViewRuleListFormSubmitRules");

   // let PopupRecordRule = null;
   // let PopupSubmitRule = null;

   // const ABViewFormPropertyComponentDefaults = ABViewFormCore.defaultValues();

   return class ABViewForm extends ABViewFormCore {

      static getPluginType() {
         return "view";
      }

      /**
             * @method getPluginKey
             * return the plugin key for this view.
             * @return {string} plugin key
             */
      static getPluginKey() {
         return this.common().key;
      }

      static common() {
         return ABViewFormDefaults;
      }

      /**
             * @method component()
             * return a UI component based upon this view.
             * @return {obj} UI component
             */
      component(parentId) {
         return new ABAbviewformComponent(this, parentId);
      }


      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues);

         this._callbacks = {
            onBeforeSaveData: () => true,
         };
      }

      superComponent() {
         if (this._superComponent == null)
            this._superComponent = super.component();

         return this._superComponent;
      }



      refreshDefaultButton(ids) {
         // If default button is not exists, then skip this
         const ButtonClass = this.application.ViewManager?.viewClass?.("button");
         if (!ButtonClass) return;

         let defaultButton = this.views(
            (v) => v?.key === "button" && v?.settings?.isDefault
         )[0];

         if (!defaultButton) {
            defaultButton = ButtonClass.newInstance(this.application, this);
            defaultButton.settings = defaultButton.settings || {};
            defaultButton.settings.isDefault = true;
         } else {
            this._views = this._views.filter((v) => v.id !== defaultButton.id);
         }

         const yList = this._views.map((v) => (v.position?.y || 0) + 1);
         const posY = yList.length ? Math.max(...yList) : 0;

         defaultButton.position = defaultButton.position || {};
         defaultButton.position.y = posY;

         this._views.push(defaultButton);

         return defaultButton;
      }

      /**
       * @method getFormValues
       *
       * @param {webix form} formView
       * @param {ABObject} obj
       * @param {ABDatacollection} dc
       * @param {ABDatacollection} dcLink [optional]
       */
      getFormValues(formView, obj, dc, dcLink) {
         // get the fields that are on this form
         const visibleFields = ["id"]; // we always want the id so we can udpate records
         formView.getValues(function (obj) {
            visibleFields.push(obj.config.name);
         });

         // only get data passed from form
         const allVals = formView.getValues();
         const formVals = {};
         visibleFields.forEach((val) => {
            formVals[val] = allVals[val];
         });

         // get custom values
         this.fieldComponents(
            (comp) =>
               comp?.key === "formcustom" ||
               comp?.key === "formconnect" ||
               comp?.key === "formdatepicker" ||
               comp?.key === "formselectmultiple" ||
               (comp?.key === "formjson" && comp?.settings?.type === "filter")
         ).forEach((f) => {
            const vComponent = this.viewComponents[f.id];
            if (vComponent == null) return;

            const field = f.field();
            if (field) {
               const getValue = vComponent.getValue ?? vComponent.logic.getValue;
               if (getValue)
                  formVals[field.columnName] = getValue.call(vComponent, formVals);
            }
         });

         // remove connected fields if they were not on the form and they are present in the formVals because it is a datacollection
         obj.connectFields().forEach((f) => {
            if (
               visibleFields.indexOf(f.columnName) == -1 &&
               formVals[f.columnName]
            ) {
               delete formVals[f.columnName];
               delete formVals[f.relationName()];
            }
         });

         // clear undefined values or empty arrays
         for (const prop in formVals) {
            if (formVals[prop] == null || formVals[prop].length == 0)
               formVals[prop] = "";
         }

         // Add parent's data collection cursor when a connect field does not show
         let linkValues;

         if (dcLink) {
            linkValues = dcLink.getCursor();
         }

         if (linkValues) {
            const objectLink = dcLink.datasource;

            const connectFields = obj.connectFields();
            connectFields.forEach((f) => {
               const formFieldCom = this.fieldComponents(
                  (fComp) => fComp?.field?.()?.id === f?.id
               );

               if (
                  objectLink.id == f.settings.linkObject &&
                  formFieldCom.length < 1 && // check field does not show
                  formVals[f.columnName] === undefined
               ) {
                  const linkColName = f.indexField
                     ? f.indexField.columnName
                     : objectLink.PK();

                  formVals[f.columnName] = {};
                  formVals[f.columnName][linkColName] =
                     linkValues[linkColName] ?? linkValues.id;
               }
            });
         }

         // NOTE: need to pull data of current cursor to calculate Calculate & Formula fields
         // .formVals variable does not include data that does not display in the Form widget
         const cursorFormVals = Object.assign(dc.getCursor() ?? {}, formVals);

         // Set value of calculate or formula fields to use in record rule
         obj.fields((f) => f.key == "calculate" || f.key == "formula").forEach(
            (f) => {
               if (formVals[f.columnName] == null) {
                  let reCalculate = true;

                  // WORKAROUND: If "Formula" field will have Filter conditions,
                  // Then it is not able to re-calculate on client side
                  // because relational data is not full data so FilterComplex will not have data to check
                  if (f.key == "formula" && f.settings?.where?.rules?.length > 0) {
                     reCalculate = false;
                  }

                  formVals[f.columnName] = f.format(cursorFormVals, reCalculate);
               }
            }
         );

         if (allVals.translations?.length > 0)
            formVals.translations = allVals.translations;

         // give the Object a final chance to review the data being handled.
         obj.formCleanValues(formVals);

         return formVals;
      }

      /**
       * @method validateData
       *
       * @param {webix form} formView
       * @param {ABObject} object
       * @param {object} formVals
       *
       * @return {boolean} isValid
       */
      validateData($formView, object, formVals) {
         let list = "";

         // validate required fields
         const requiredFields = this.fieldComponents(
            (fComp) =>
               fComp?.field?.().settings?.required == true ||
               fComp?.settings?.required == true
         ).map((fComp) => fComp.field());

         // validate data
         const validator = object.isValidData(formVals);
         let isValid = validator.pass();

         // $$($formView).validate();
         $formView.validate();
         /**
          * helper function to fix the webix ui after adding an validation error
          * message.
          * @param {string} col - field.columnName
          */
         const fixInvalidMessageUI = (col) => {
            const $forminput = $formView.elements[col];
            if (!$forminput) return;
            // Y position
            const height = $forminput.$height;
            if (height < 56) {
               $forminput.define("height", 60);
               $forminput.resize();
            }

            // X position
            const domInvalidMessage = $forminput.$view.getElementsByClassName(
               "webix_inp_bottom_label"
            )[0];
            if (!domInvalidMessage?.style["margin-left"]) {
               domInvalidMessage.style.marginLeft = `${this.settings.labelWidth ??
                  ABViewFormPropertyComponentDefaults.labelWidth
                  }px`;
            }
         };

         // Display required messages
         requiredFields.forEach((f) => {
            if (!f) return;

            const fieldVal = formVals[f.columnName];
            if (fieldVal == "" || fieldVal == null || fieldVal.length < 1) {
               $formView.markInvalid(f.columnName, this.AB.Multilingual.label("This is a required field."));
               list += `<li>${this.AB.Multilingual.label("Missing Required Field")} ${f.columnName}</li>`;
               isValid = false;

               // Fix position of invalid message
               fixInvalidMessageUI(f.columnName);
            }
         });

         // if data is invalid
         if (!isValid) {
            const saveButton = $formView.queryView({
               view: "button",
               type: "form",
            });

            // error message
            if (validator?.errors?.length) {
               validator.errors.forEach((err) => {
                  $formView.markInvalid(err.name, err.message);
                  list += `<li>${err.name}: ${err.message}</li>`;
                  fixInvalidMessageUI(err.name);
               });

               saveButton?.disable();
            } else {
               saveButton?.enable();
            }
         }
         if (list) {
            webix.alert({
               type: "alert-error",
               title: this.AB.Multilingual.label("Problems Saving"),
               width: 400,
               text: `<ul style='text-align:left'>${list}</ul>`,
            });
         }

         return isValid;
      }

      /**
       * @method recordRulesReady()
       * This returns a Promise that gets resolved when all record rules report
       * that they are ready.
       * @return {Promise}
       */
      async recordRulesReady() {
         return this.RecordRule.rulesReady();
      }

      /**
       * @method saveData
       * save data in to database
       * @param $formView - webix's form element
       *
       * @return {Promise}
       */
      async saveData($formView) {
         // call .onBeforeSaveData event
         // if this function returns false, then it will not go on.
         if (!this._callbacks?.onBeforeSaveData?.()) return;

         $formView.clearValidation();

         // get ABDatacollection
         const dv = this.datacollection;
         if (dv == null) return;

         // get ABObject
         const obj = dv.datasource;
         if (obj == null) return;

         // show progress icon
         $formView.showProgress?.({ type: "icon" });

         // get update data
         const formVals = this.getFormValues(
            $formView,
            obj,
            dv,
            dv.datacollectionLink
         );

         // form ready function
         const formReady = (newFormVals) => {
            // clear cursor after saving.
            if (dv) {
               if (this.settings.clearOnSave) {
                  dv.setCursor(null);
                  $formView.clear();
               } else {
                  if (newFormVals && newFormVals.id) dv.setCursor(newFormVals.id);
               }
            }

            $formView.hideProgress?.();

            // if there was saved data pass it up to the onSaveData callback
            // if (newFormVals) this._logic.callbacks.onSaveData(newFormVals);
            if (newFormVals) this.emit("saved", newFormVals); // Q? is this the right upgrade?
         };

         const formError = (err) => {
            const $saveButton = $formView.queryView({
               view: "button",
               type: "form",
            });

            // mark error
            if (err) {
               if (err.invalidAttributes) {
                  for (const attr in err.invalidAttributes) {
                     let invalidAttrs = err.invalidAttributes[attr];
                     if (invalidAttrs && invalidAttrs[0])
                        invalidAttrs = invalidAttrs[0];

                     $formView.markInvalid(attr, invalidAttrs.message);
                  }
               } else if (err.sqlMessage) {
                  webix.message({
                     text: err.sqlMessage,
                     type: "error",
                  });
               } else {
                  webix.message({
                     text: this.AB.Multilingual.label("System could not save your data"),
                     type: "error",
                  });
                  this.AB.notify.developer(err, {
                     message: "Could not save your data",
                     view: this.toObj(),
                  });
               }
            }

            $saveButton?.enable();

            $formView?.hideProgress?.();
         };

         // Load data of DCs that use in record rules
         await this.loadDcDataOfRecordRules();

         // wait for our Record Rules to be ready before we continue.
         await this.recordRulesReady();

         // update value from the record rule (pre-update)
         this.doRecordRulesPre(formVals);

         // validate data
         if (!this.validateData($formView, obj, formVals)) {
            // console.warn("Data is invalid.");
            $formView.hideProgress?.();
            return;
         }
         let newFormVals;
         try {
            newFormVals = await this.submitValues(formVals);
         } catch (err) {
            formError(err.data);
            return;
         }
         // {obj}
         // The fully populated values returned back from service call
         // We use this in our post processing Rules

         /*
         // OLD CODE:
         try {
            await this.doRecordRules(newFormVals);
            // make sure any updates from RecordRules get passed along here.
            this.doSubmitRules(newFormVals);
            formReady(newFormVals);
            return newFormVals;
         } catch (err) {
            this.AB.notify.developer(err, {
               message: "Error processing Record Rules.",
               view: this.toObj(),
               newFormVals: newFormVals,
            });
            // Question:  how do we respond to an error?
            // ?? just keep going ??
            this.doSubmitRules(newFormVals);
            formReady(newFormVals);
            return;
         }
         */

         try {
            await this.doRecordRules(newFormVals);
         } catch (err) {
            this.AB.notify.developer(err, {
               message: "Error processing Record Rules.",
               view: this.toObj(),
               newFormVals: newFormVals,
            });
         }

         // make sure any updates from RecordRules get passed along here.
         try {
            this.doSubmitRules(newFormVals);
         } catch (errs) {
            this.AB.notify.developer(errs, {
               message: "Error processing Submit Rules.",
               view: this.toObj(),
               newFormVals: newFormVals,
            });
         }

         formReady(newFormVals);
         return newFormVals;
      }

      focusOnFirst() {
         let topPosition = 0;
         let topPositionId = "";
         this.views().forEach((item) => {
            if (item.key == "textbox" || item.key == "numberbox") {
               if (item.position.y == topPosition) {
                  // topPosition = item.position.y;
                  topPositionId = item.id;
               }
            }
         });
         let childComponent = this.viewComponents[topPositionId];
         if (childComponent && $$(childComponent.ui.id)) {
            $$(childComponent.ui.id).focus();
         }
      }

      async loadDcDataOfRecordRules() {
         const tasks = [];

         (this.settings?.recordRules ?? []).forEach((rule) => {
            (rule?.actionSettings?.valueRules?.fieldOperations ?? []).forEach(
               (op) => {
                  if (op.valueType !== "exist") return;

                  const pullDataDC = this.AB.datacollectionByID(op.value);

                  if (
                     pullDataDC?.dataStatus ===
                     pullDataDC.dataStatusFlag.notInitial
                  )
                     tasks.push(pullDataDC.loadData());
               }
            );
         });

         await Promise.all(tasks);

         return true;
      }

      get viewComponents() {
         const superComponent = this.superComponent();
         return superComponent.viewComponents;
      }

      warningsEval() {
         super.warningsEval();

         let DC = this.datacollection;
         if (!DC) {
            this.warningsMessage(
               `can't resolve it's datacollection[${this.settings.dataviewID}]`
            );
         }

         if (this.settings.recordRules) {
            // TODO: scan recordRules for warnings
         }

         if (this.settings.submitRules) {
            // TODO: scan submitRules for warnings.
         }
      }

      async submitValues(formVals) {
         // get ABModel
         const model = this.datacollection.model;
         if (model == null) return;

         // is this an update or create?
         if (formVals.id) {
            return await model.update(formVals.id, formVals);
         } else {
            return await model.create(formVals);
         }
      }

      /**
       * @method deleteData
       * delete data in to database
       * @param $formView - webix's form element
       *
       * @return {Promise}
       */
      async deleteData($formView) {
         // get ABDatacollection
         const dc = this.datacollection;
         if (dc == null) return;

         // get ABObject
         const obj = dc.datasource;
         if (obj == null) return;

         // get ABModel
         const model = dc.model;
         if (model == null) return;

         // get update data
         const formVals = $formView.getValues();

         if (formVals?.id) {
            const result = await model.delete(formVals.id);

            // clear form
            if (result) {
               dc.setCursor(null);
               $formView.clear();
            }

            return result;
         }
      }
   };

}

