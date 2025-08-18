/*
 * formioBuilder
 *
 * Create a custom webix component.
 *
 * Note: Moved from ABDesigner to prevent loading formIO library globally or
 * duplicating it. Revisit when formIOv5 releases as it should then be possible
 * to package the form renderer without the builder.
 *
 * Note: This component is lazy loaded and requires calling .init() before using
 */
import ABLazyCustomComponent from "./lazyComponent.js";
export default class ABCustomFormBuilderBuilder extends ABLazyCustomComponent {
   get key() {
      return "formiobuilder";
   }

   constructor(App) {
      super(App);
      this.label = this.AB.Label();
      this.view = this.key;
   }

   /**
    * Load the FormIO dependency and add the component to webix
    * @returns {Promise<null>}
    */
   async init() {
      if (this.initialized) return;
      const { FormBuilder } = await import(
         /* webpackPrefetch: true */
         /* webpackFetchPrioirtiy: "low" */
         "../init/formio.js"
      );
      this.FormBuilder = FormBuilder;
      // Tell Webix to create an INSTANCE of our custom component:
      this.AB.Webix.protoUI(this.ui(), this.AB.Webix.ui.popup);
      this.initialized = true;
   }

   /**
    * Generate the custom webix ui
    * @method ui
    * @returns {Object} custom webix ui
    */
   ui() {
      const _this = this;

      return {
         name: this.key,
         defaults: {
            css: "scrolly forceOpen",
            hidden: false,
            autofit: true,
         },
         $init: async function (config) {
            let comp = {},
               defaultComponent;
            if (config.dataFields)
               Object.assign(
                  comp,
                  this.parseDataFields(config.dataFields, {
                     isCommonForm: config.isCommonForm,
                  })
               );
            if (config.isCommonForm) {
               Object.assign(comp, _this.inputComponents());
               defaultComponent = comp.saveButton.schema;
            } else defaultComponent = comp.approveButton.schema;

            const formComponents = config.formComponents
               ? config.formComponents
               : { components: [defaultComponent] };

            try {
               this.builder = new this.FormBuilder(this.$view, formComponents, {
                  noDefaultSubmitButton: true,
                  noNewEdit: true,
                  builder: {
                     basic: false,
                     advanced: false,
                     customBasic: false,
                     premium: false,
                     custom: {
                        title: this.label("Fields"),
                        weight: 0,
                        default: true,
                        components: comp,
                     },
                     layout: {
                        components: {
                           table: true,
                        },
                     },
                  },
               });
               await this.builder.ready;
            } catch (err) {
               this.notify("Error initializing formio builder", err);
            }
         },
         // set up a function that can be called to request the form schema
         getFormData: function () {
            return this.builder.schema ?? this.builder.form;
         },
         // Pass functions into the Webix component to be use in $init
         label: this.label,
         parseDataFields: this.parseDataFields,
         notify: this.AB.notify.developer,
         FormBuilder: this.FormBuilder,
      };
   }

   /**
    * Generate the formio custom components based on the fields.
    * Used internally in the webix component.
    * @method parseDataFields
    * @param {object[]} fields {field: ABField, key, label, object: ABObject}
    * @returns {object} each key is a formio component
    */
   parseDataFields(fields, { isCommonForm } = { isCommonForm: true }) {
      const components = {};
      fields?.forEach(({ field, key, label }) => {
         if (!field) {
            components[key] = {
               title: label,
               key,
               schema: {
                  label: label.split("->")[1],
                  disabled: true,
                  key,
                  _key: key,
                  type: "textarea",
                  input: true,
               },
            };
            return;
         }

         const schema = {
            abFieldID: field.id,
            label: field.label,
            disabled: true,
            key,
            _key: key,
            type: "textfield",
            input: true,
         };

         switch (field.key) {
            case "boolean":
               schema.type = "checkbox";
               break;
            case "calculate":
               schema.inputType = "text";
               schema.calculateValue = `value = ${field.settings.formula
                  .replace(/{/g, "data['")
                  .replace(/}/g, "']")}`;
               break;
            case "connectObject":
               schema.inputType = "text";
               schema.calculateValue = `value = data['${key}.format']`;
               break;
            case "date":
               schema.type = "datetime";
               schema.format = "MMMM d, yyyy";
               break;
            case "datetime":
               schema.type = "datetime";
               schema.format = "MMMM d, yyyy h:mm a";
               break;
            case "email":
               schema.type = "email";
               break;
            case "file":
               schema.type = "htmlelement";
               schema.tag = "a";
               schema.className = "btn btn-primary btn-block";
               schema.content = `<i class='fa fa-paperclip'></i> {{data['${key}']?.filename ?? "No File"}}`;
               schema.attrs = [
                  {
                     attr: "href",
                     value: field.urlFile(`{{data['${key}'].uuid}}`),
                  },
                  {
                     attr: "target",
                     value: "_blank",
                  },
               ];
               schema.refreshOnChange = true;
               schema.input = false;
               break;
            case "image":
               schema.type = "htmlelement";
               schema.tag = "img";
               schema.className = "img-thumbnail max100";
               schema.content = "";
               (schema.attrs = [
                  {
                     attr: "src",
                     value: field.urlImage(`{{data['${key}']}}`),
                  },
               ]),
                  (schema.refreshOnChange = true);
               schema.input = false;
               break;
            case "list":
               var values = [];
               field.settings.options.forEach((opt) => {
                  values.push({
                     label: opt.text,
                     value: opt.id,
                  });
               });
               schema.type = "select";
               schema.data = { values };
               schema.multiple = field.settings.isMultiple;
               break;
            case "LongText":
               schema.type = "textarea";
               break;
            case "number":
               schema.type = "number";
               break;
            case "TextFormula":
               schema.inputType = "text";
               schema.calculateValue = `value = '${field.settings.textFormula}'`;
               break;
            default:
               break;
         }
         components[key] = {
            title: label,
            key,
            icon: field.icon,
            schema,
         };
      });

      if (!isCommonForm) {
         components["approveButton"] = {
            title: this.label("Approve Button"),
            key: "approve",
            icon: "check-square",
            schema: {
               label: this.label("Approve"),
               type: "button",
               key: "approve",
               event: "approve",
               block: true,
               size: "lg",
               input: false,
               leftIcon: "fa fa-thumbs-up",
               action: "event",
               theme: "success",
            },
         };
         components["denyButton"] = {
            title: this.label("Deny Button"),
            key: "deny",
            icon: "ban",
            schema: {
               label: this.label("Deny"),
               type: "button",
               key: "deny",
               event: "deny",
               block: true,
               size: "lg",
               input: false,
               leftIcon: "fa fa-thumbs-down",
               action: "event",
               theme: "danger",
            },
         };
         components["customButton"] = {
            title: this.label("Custom Action Button"),
            key: "custom",
            icon: "cog",
            schema: {
               label: this.label("Custom Name"),
               type: "button",
               key: "custom",
               event: "yourEvent",
               block: true,
               size: "lg",
               input: false,
               leftIcon: "fa fa-cog",
               action: "event",
               theme: "primary",
            },
         };
      }

      return components;
   }

   inputComponents() {
      return {
         textbox: {
            title: "Textbox",
            key: "YOUR_KEY",
            icon: "font",
            schema: {
               type: "textfield",
               key: "YOUR_KEY",
               label: "[YOUR LABEL]",
               placeholder: "Enter your information.",
               input: true,
            },
         },
         textarea: {
            title: "Textarea",
            key: "YOUR_KEY",
            icon: "bold",
            schema: {
               type: "textarea",
               key: "YOUR_KEY",
               label: "[YOUR LABEL]",
               placeholder: "Enter your information.",
            },
         },
         saveButton: {
            title: "Submit Button",
            key: "submit",
            icon: "check-square",
            schema: {
               label: "Submit",
               type: "button",
               key: "submit",
               event: "submit",
               block: true,
               size: "lg",
               input: false,
               leftIcon: "fa fa-check-square",
               action: "event",
               theme: "success",
            },
         },
      };
   }
}
