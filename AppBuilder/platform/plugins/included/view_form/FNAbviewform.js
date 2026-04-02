import FNAbviewformComponent from "./FNAbviewformComponent.js";
import FNAbviewformButton from "./FNAbviewformButton.js";
import FNAbviewformCheckbox from "./FNAbviewformCheckbox.js";
import FNAbviewformConnect from "./FNAbviewformConnect.js";
import FNAbviewformCustom from "./FNAbviewformCustom.js";
import FNAbviewformDatepicker from "./FNAbviewformDatepicker.js";
import FNAbviewformItem from "./FNAbviewformItem.js";
import FNAbviewformJson from "./FNAbviewformJson.js";
import FNAbviewformNumber from "./FNAbviewformNumber.js";
import FNAbviewformReadonly from "./FNAbviewformReadonly.js";
import FNAbviewformSelectMultiple from "./FNAbviewformSelectMultiple.js";
import FNAbviewformSelectSingle from "./FNAbviewformSelectSingle.js";
import FNAbviewformTree from "./FNAbviewformTree.js";
import FNAbviewformTextbox from "./FNAbviewformTextbox.js";
import FNAbviewformURL from "./FNAbviewformURL.js";

// Internalized Core Factories
import FNAbviewformCore from "./core/ABViewFormCore.js";
import FNAbviewformItemCore from "./core/ABViewFormItemCore.js";
import FNAbviewformButtonCore from "./core/ABViewFormButtonCore.js";
import FNAbviewformCheckboxCore from "./core/ABViewFormCheckboxCore.js";
import FNAbviewformConnectCore from "./core/ABViewFormConnectCore.js";
import FNAbviewformCustomCore from "./core/ABViewFormCustomCore.js";
import FNAbviewformDatepickerCore from "./core/ABViewFormDatepickerCore.js";
import FNAbviewformJsonCore from "./core/ABViewFormJsonCore.js";
import FNAbviewformNumberCore from "./core/ABViewFormNumberCore.js";
import FNAbviewformReadonlyCore from "./core/ABViewFormReadonlyCore.js";
import FNAbviewformSelectMultipleCore from "./core/ABViewFormSelectMultipleCore.js";
import FNAbviewformSelectSingleCore from "./core/ABViewFormSelectSingleCore.js";
import FNAbviewformTreeCore from "./core/ABViewFormTreeCore.js";
import FNAbviewformTextboxCore from "./core/ABViewFormTextboxCore.js";
import FNAbviewformURLCore from "./core/ABViewFormURLCore.js";

/**
 * FNAbviewform
 * A web side import for an ABViewForm.
 */
export default function FNAbviewform(API) {
   const {
      ABViewComponentPlugin,
      ABViewPlugin,
      ABViewContainer,
      ABViewRuleListFormRecordRules,
      ABViewRuleListFormSubmitRules,
      ABViewPropertyAddPage,
      ABViewPropertyEditPage,
      ABFieldImage,
      FocusableTemplate,
      AB,
   } = API;

   // Initialize Core Classes from Factories
   const ABViewFormItemCore = FNAbviewformItemCore(ABViewPlugin);

   const ABViewFormItem = FNAbviewformItem({
      ABViewComponentPlugin,
      ABViewFormItemCore,
   });

   // Store ABViewFormItem for'instanceof' checks in other plugins
   if (AB && AB.Class) {
      AB.Class.ABViewFormItem = ABViewFormItem;
   }

   const ABViewFormItemComponent = ABViewFormItem.ABViewFormItemComponent;
   if (!ABViewFormItemComponent) {
      const error = new Error(
         "FNAbviewform: ABViewFormItem.ABViewFormItemComponent is undefined"
      );
      console.error(error);
      // Fallback or more descriptive error could go here if needed
   }

   const ABViewFormButtonCore = FNAbviewformButtonCore(ABViewPlugin);
   const ABViewFormButton = FNAbviewformButton({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormButtonCore,
   });

   const ABViewFormCheckboxCore = FNAbviewformCheckboxCore(ABViewFormItemCore);
   const ABViewFormCheckbox = FNAbviewformCheckbox({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormCheckboxCore,
   });

   const ABViewFormConnectCore = FNAbviewformConnectCore(ABViewFormItemCore);
   const ABViewFormConnect = FNAbviewformConnect({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormConnectCore,
      ABViewPropertyAddPage,
      ABViewPropertyEditPage,
   });

   const ABViewFormCustomCore = FNAbviewformCustomCore(ABViewFormItemCore);
   const ABViewFormCustom = FNAbviewformCustom({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormCustomCore,
      ABFieldImage,
      FocusableTemplate,
   });

   const ABViewFormDatepickerCore =
      FNAbviewformDatepickerCore(ABViewFormItemCore);
   const ABViewFormDatepicker = FNAbviewformDatepicker({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormDatepickerCore,
   });

   const ABViewFormJsonCore = FNAbviewformJsonCore(ABViewFormItemCore);
   const ABViewFormJson = FNAbviewformJson({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormJsonCore,
   });

   const ABViewFormNumberCore = FNAbviewformNumberCore(ABViewFormItemCore);
   const ABViewFormNumber = FNAbviewformNumber({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormNumberCore,
   });

   const ABViewFormReadonlyCore =
      FNAbviewformReadonlyCore(ABViewFormCustomCore);
   const ABViewFormReadonly = FNAbviewformReadonly({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormReadonlyCore,
      ABFieldImage,
      FocusableTemplate,
   });

   const ABViewFormSelectMultipleCore =
      FNAbviewformSelectMultipleCore(ABViewFormItemCore);
   const ABViewFormSelectMultiple = FNAbviewformSelectMultiple({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormSelectMultipleCore,
   });

   const ABViewFormSelectSingleCore =
      FNAbviewformSelectSingleCore(ABViewFormItemCore);
   const ABViewFormSelectSingle = FNAbviewformSelectSingle({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormSelectSingleCore,
   });

   const ABViewFormTreeCore = FNAbviewformTreeCore(ABViewFormCustomCore);
   const ABViewFormTree = FNAbviewformTree({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormTreeCore,
      ABFieldImage,
      FocusableTemplate,
   });

   const ABViewFormTextboxCore = FNAbviewformTextboxCore(ABViewFormItemCore);
   const ABViewFormTextbox = FNAbviewformTextbox({
      ABViewComponentPlugin,
      ABViewFormItemComponent,
      ABViewFormTextboxCore,
   });

   const ABAbviewformComponent = FNAbviewformComponent({
      ABViewComponentPlugin,
      ABViewFormButton,
      ABViewFormCheckbox,
      ABViewFormConnect,
      ABViewFormCustom,
      ABViewFormDatepicker,
      ABViewFormItem,
      ABViewFormJson,
      ABViewFormNumber,
      ABViewFormReadonly,
      ABViewFormSelectMultiple,
      ABViewFormSelectSingle,
      ABViewFormTree,
      ABViewFormTextbox,
   });

   const ABRecordRule = ABViewRuleListFormRecordRules;
   const ABSubmitRule = ABViewRuleListFormSubmitRules;

   const ABViewFormBase = FNAbviewformCore(
      ABViewContainer,
      ABViewFormItem,
      ABRecordRule,
      ABSubmitRule
   );

   ABViewFormBase.prototype.superComponent = function () {
      if (this._superComponent == null) {
         this._superComponent = ABViewContainer.prototype.component.call(this);
      }
      return this._superComponent;
   };

   const ABViewFormURLCore = FNAbviewformURLCore(ABViewFormBase);
   const ABViewFormURL = FNAbviewformURL({
      ABAbviewformComponent,
      ABViewFormURLCore,
   });

   const views = [
      ABViewFormButton,
      ABViewFormCheckbox,
      ABViewFormConnect,
      ABViewFormCustom,
      ABViewFormDatepicker,
      ABViewFormJson,
      ABViewFormNumber,
      ABViewFormReadonly,
      ABViewFormSelectMultiple,
      ABViewFormSelectSingle,
      ABViewFormTree,
      ABViewFormTextbox,
      ABViewFormURL,
   ];

   views.forEach((v) => {
      v.getPluginKey = () => v.common().key;
      v.getPluginType = () => "view";
   });

   class ABViewForm extends ABViewFormBase {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues);
         this._callbacks = {
            onBeforeSaveData: () => true,
         };
      }

      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      static newInstance(application, parent) {
         return application.viewNew(
            { key: this.common().key, plugin_key: this.getPluginKey() },
            parent
         );
      }

      toObj() {
         const result = super.toObj();
         result.plugin_key = this.constructor.getPluginKey();
         return result;
      }

      component(parentId) {
         return new ABAbviewformComponent(this, parentId);
      }

      refreshDefaultButton(ids) {
         let defaultButton = this.views(
            (v) => v instanceof ABViewFormButton && v.settings.isDefault
         )[0];
         if (defaultButton == null) {
            defaultButton = ABViewFormButton.newInstance(
               this.application,
               this
            );
            defaultButton.settings.isDefault = true;
         } else {
            this._views = this.views((v) => v.id != defaultButton.id);
         }
         let yList = this.views().map((v) => (v.position.y || 0) + 1);
         yList.push(this._views.length || 0);
         yList.push($$(ids.fields).length || 0);
         let posY = Math.max(...yList);
         defaultButton.position.y = posY;
         this._views.push(defaultButton);
         return defaultButton;
      }

      getFormValues(formView, obj, dc, dcLink) {
         const visibleFields = ["id"];
         formView.getValues(function (obj) {
            visibleFields.push(obj.config.name);
         });
         const allVals = formView.getValues();
         const formVals = {};
         visibleFields.forEach((val) => {
            formVals[val] = allVals[val];
         });
         this.fieldComponents(
            (comp) =>
               comp instanceof ABViewFormCustom ||
               comp instanceof ABViewFormConnect ||
               comp instanceof ABViewFormDatepicker ||
               comp instanceof ABViewFormSelectMultiple ||
               (comp instanceof ABViewFormJson &&
                  comp.settings.type == "filter")
         ).forEach((f) => {
            const vComponent = this.viewComponents[f.id];
            if (vComponent == null) return;
            const field = f.field();
            if (field) {
               const getValue =
                  vComponent.getValue ?? vComponent.logic.getValue;
               if (getValue)
                  formVals[field.columnName] = getValue.call(
                     vComponent,
                     formVals
                  );
            }
         });
         obj.connectFields().forEach((f) => {
            if (
               visibleFields.indexOf(f.columnName) == -1 &&
               formVals[f.columnName]
            ) {
               delete formVals[f.columnName];
               delete formVals[f.relationName()];
            }
         });
         for (const prop in formVals) {
            if (formVals[prop] == null || formVals[prop].length == 0)
               formVals[prop] = "";
         }
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
                  formFieldCom.length < 1 &&
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
         const cursorFormVals = Object.assign(dc.getCursor() ?? {}, formVals);
         obj.fields((f) => f.key == "calculate" || f.key == "formula").forEach(
            (f) => {
               if (formVals[f.columnName] == null) {
                  let reCalculate = true;
                  if (
                     f.key == "formula" &&
                     f.settings?.where?.rules?.length > 0
                  ) {
                     reCalculate = false;
                  }
                  formVals[f.columnName] = f.format(
                     cursorFormVals,
                     reCalculate
                  );
               }
            }
         );
         if (allVals.translations?.length > 0)
            formVals.translations = allVals.translations;
         obj.formCleanValues(formVals);
         return formVals;
      }

      validateData($formView, object, formVals) {
         let list = "";
         const requiredFields = this.fieldComponents(
            (fComp) =>
               fComp?.field?.().settings?.required == true ||
               fComp?.settings?.required == true
         ).map((fComp) => fComp.field());
         const validator = object.isValidData(formVals);
         let isValid = validator.pass();
         $formView.validate();
         const fixInvalidMessageUI = (col) => {
            const $forminput = $formView.elements[col];
            if (!$forminput) return;
            const height = $forminput.$height;
            if (height < 56) {
               $forminput.define("height", 60);
               $forminput.resize();
            }
            const domInvalidMessage = $forminput.$view.getElementsByClassName(
               "webix_inp_bottom_label"
            )[0];
            if (!domInvalidMessage?.style["margin-left"]) {
               domInvalidMessage.style.marginLeft = `${
                  this.settings.labelWidth ??
                  ABViewFormPropertyComponentDefaults.labelWidth
               }px`;
            }
         };
         requiredFields.forEach((f) => {
            if (!f) return;
            const fieldVal = formVals[f.columnName];
            if (fieldVal == "" || fieldVal == null || fieldVal.length < 1) {
               $formView.markInvalid(
                  f.columnName,
                  this.AB.Label()("This is a required field.")
               );
               list += `<li>${this.AB.Label()("Missing Required Field")} ${
                  f.columnName
               }</li>`;
               isValid = false;
               fixInvalidMessageUI(f.columnName);
            }
         });
         if (!isValid) {
            const saveButton = $formView.queryView({
               view: "button",
               type: "form",
            });
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
            this.AB.Webix.alert({
               type: "alert-error",
               title: this.AB.Label()("Problems Saving"),
               width: 400,
               text: `<ul style='text-align:left'>${list}</ul>`,
            });
         }
         return isValid;
      }

      async recordRulesReady() {
         return this.RecordRule.rulesReady();
      }

      async saveData($formView) {
         if (!this._callbacks?.onBeforeSaveData?.()) return;
         $formView.clearValidation();
         const dv = this.datacollection;
         if (dv == null) return;
         const obj = dv.datasource;
         if (obj == null) return;
         $formView.showProgress?.({ type: "icon" });
         const formVals = this.getFormValues(
            $formView,
            obj,
            dv,
            dv.datacollectionLink
         );
         const formReady = (newFormVals) => {
            if (dv) {
               if (this.settings.clearOnSave) {
                  dv.setCursor(null);
                  $formView.clear();
               } else {
                  if (newFormVals && newFormVals.id)
                     dv.setCursor(newFormVals.id);
               }
            }
            $formView.hideProgress?.();
            if (newFormVals) this.emit("saved", newFormVals);
         };
         const formError = (err) => {
            const $saveButton = $formView.queryView({
               view: "button",
               type: "form",
            });
            if (err) {
               if (err.invalidAttributes) {
                  for (const attr in err.invalidAttributes) {
                     let invalidAttrs = err.invalidAttributes[attr];
                     if (invalidAttrs && invalidAttrs[0])
                        invalidAttrs = invalidAttrs[0];
                     $formView.markInvalid(attr, invalidAttrs.message);
                  }
               } else if (err.sqlMessage) {
                  this.AB.Webix.message({
                     text: err.sqlMessage,
                     type: "error",
                  });
               } else {
                  this.AB.Webix.message({
                     text: this.AB.Label()("System could not save your data"),
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
         await this.loadDcDataOfRecordRules();
         await this.recordRulesReady();
         this.doRecordRulesPre(formVals);
         if (!this.validateData($formView, obj, formVals)) {
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
         try {
            await this.doRecordRules(newFormVals);
         } catch (err) {
            this.AB.notify.developer(err, {
               message: "Error processing Record Rules.",
               view: this.toObj(),
               newFormVals: newFormVals,
            });
         }
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
      }

      async submitValues(formVals) {
         const model = this.datacollection?.model;
         if (model == null) return;
         if (formVals.id) {
            return await model.update(formVals.id, formVals);
         } else {
            return await model.create(formVals);
         }
      }

      async deleteData($formView) {
         const dc = this.datacollection;
         if (dc == null) return;
         const model = dc.model;
         if (model == null) return;
         const formVals = $formView.getValues();
         if (formVals?.id) {
            const result = await model.delete(formVals.id);
            if (result) {
               dc.setCursor(null);
               $formView.clear();
            }
            return result;
         }
      }
   }

   ABViewForm.getPluginKey = () => ABViewForm.common().key;
   ABViewForm.getPluginType = () => "view";

   // Store ABViewForm for'instanceof' checks in other plugins
   if (AB && AB.Class) {
      AB.Class.ABViewForm = ABViewForm;
   }

   return [ABViewForm, ...views];
}
