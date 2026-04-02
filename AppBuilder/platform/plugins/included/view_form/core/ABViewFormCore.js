export default function (
   ABViewContainer,
   ABViewFormItem,
   ABRecordRule,
   ABSubmitRule
) {
   const ABViewFormDefaults = {
      key: "form", // unique key identifier for this ABViewForm
      icon: "list-alt", // icon reference: (without 'fa-' )
      labelKey: "Form", // {string} the multilingual label key for the class label
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

   return class ABViewFormCore extends ABViewContainer {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormDefaults
         );
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
               filter = (comp) => comp.isFormField;
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
         let object = this.datacollection?.datasource;

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
}
