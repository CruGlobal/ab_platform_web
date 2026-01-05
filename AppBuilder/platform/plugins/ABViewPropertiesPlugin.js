import ABClassUIPlugin from "./ABClassUIPlugin.js";

export default class ABViewPropertiesPlugin extends ABClassUIPlugin {
   constructor(base = "properties_abview", ids = {}) {
      // base: {string} unique base id reference
      // ids: {hash}  { key => '' }
      // this is provided by the Sub Class and has the keys
      // unique to the Sub Class' interface elements.

      var common = {
         label: "",
      };

      Object.keys(ids).forEach((k) => {
         if (typeof common[k] != "undefined") {
            console.error(
               `!!! ABFieldProperty:: passed in ids contains a restricted field : ${k}`
            );
            return;
         }
         common[k] = "";
      });

      super(base, common);

      this.base = base;

      this.fieldsHide = {
         /* id.tag : bool */
      };
      // {hash}
      // indicates if a given field should be hidden.
      // this allows sub classes to hide fields from parent classes:
      // this.fieldsHide.required = true;  hides the required field.
   }

   static get key() {
      return this.getPluginKey();
   }

   //
   // ABView
   //

   ui(elements = [], rules = {}) {
      let ids = this.ids;

      let L = this.AB.Label();

      let _ui = {
         view: "form",
         id: ids.component,
         scroll: true,
         elements: [
            {
               id: ids.label,
               view: "text",
               label: L("Name"),
               name: "name",
               value: "",
               hidden: this.fieldsHide.label ? true : false,
            },
         ],
         rules: {
            // label: webix.rules.isNotEmpty,
         },
      };

      elements.forEach((e) => {
         _ui.elements.push(e);
      });

      Object.keys(rules).forEach((r) => {
         _ui.rules[r] = rules[r];
      });

      return _ui;
   }

   async init(AB) {
      await super.init(AB);

      this.$form = $$(this.ids.component);
      AB.Webix.extend(this.$form, webix.ProgressBar);

      var VC = this.ViewClass();
      if (VC) {
         /*
// TODO:
         $$(this.ids.fieldDescription).define(
            "label",
            L(FC.defaults().description)
         );
      } else {
         $$(this.ids.fieldDescription).hide();
*/
      }
   }

   /**
    * @method clear()
    * clear the property form.
    */
   clear() {
      $$(this.ids.label).setValue("");
   }

   propertyDatacollections(view) {
      return view.application.datacollectionsIncluded().map((d) => {
         return { id: d.id, value: d.label };
      });
   }

   /**
    * @method defaults()
    * Return the ViewClass() default values.
    * NOTE: the child class MUST implement ViewClass() to return the
    * proper ABViewXXX class definition.
    * @return {obj}
    */
   defaults() {
      var ViewClass = this.ViewClass();
      if (!ViewClass) {
         console.error("!!! properties/views/ABView: could not find ViewClass");
         return null;
      }
      return ViewClass.common();
   }

   formValues() {
      return $$(this.ids.component).getValues();
   }

   /**
    * @method isValid()
    * Verify the common ABField settings are valid before allowing
    * us to create the new field.
    * @return {bool}
    */
   isValid() {
      /*
// TODO:
      var ids = this.ids;
      var isValid = $$(ids.component).validate(),
         colName = this.formValues()["columnName"];

      // validate reserve column names
      var FC = this.FieldClass();
      if (!FC) {
         this.AB.notify.developer(
            new Error("Unable to resolve FieldClass"),
            {
               context: "ABFieldProperty: isValid()",
               base: this.ids.component,
            }
         );
      }

      // columnName should not be one of the reserved names:
      if (FC?.reservedNames.indexOf(colName.trim().toLowerCase()) > -1) {
         this.markInvalid("columnName", L("This is a reserved name"));
         isValid = false;
      }

      // columnName should not be in use by other fields on this object
      // get All fields with matching colName
      var fieldColName = this.currentObject?.fields(
         (f) => f.columnName == colName
      );
      // ignore current edit field
      if (this._CurrentField) {
         fieldColName = fieldColName.filter(
            (f) => f.id != this._CurrentField.id
         );
      }
      // if any more matches, this is a problem
      if (fieldColName.length > 0) {
         this.markInvalid(
            "columnName",
            L("This column name is in use by another field ({0})", [
               fieldColName.label,
            ])
         );
         isValid = false;
      }

      return isValid;
*/
   }

   markInvalid(name, message) {
      $$(this.ids.component).markInvalid(name, message);
   }

   /**
    * @method onChange()
    * emit a "changed" event so our property manager can know
    * there are new values that need saving.
    */
   onChange() {
      this.emit("changed");
   }

   /**
    * @function populate
    * populate the property form with the given ABField instance provided.
    * @param {ABView} view
    *        The ABViewXXX instance that we are editing the settings for.
    */
   populate(view) {
      this.viewLoad(view);
      $$(this.ids.label)?.setValue(view.label);
   }

   requiredOnChange() {
      // Sub Class should overwrite this if it is necessary.
   }

   /*
    * @function values
    *
    * return the values for this form.
    * @return {obj}
    */
   values() {
      let vals = {};
      vals.label = $$(this.ids.label).getValue();
      return vals;
   }

   /**
    * @method ViewClass()
    * A method to return the proper ABViewXXX Definition.
    * NOTE: Can be overwritten by the Child Class
    */
   ViewClass() {
      return this._ViewClass(this.constructor.key);
   }

   _ViewClass(key) {
      var app = this.CurrentApplication;
      if (!app) {
         app = this.AB.applicationNew({});
      }
      return app.viewAll((V) => V.common().key == key)[0];
   }
}
