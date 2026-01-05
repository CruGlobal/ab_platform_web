import ABClassUIPlugin from "./ABClassUIPlugin.js";

export default class ABViewEditorPlugin extends ABClassUIPlugin {
   constructor(view, base = "view_editor", ids = {}) {
      // view: {ABView} The ABView instance this editor is for
      // base: {string} unique base id reference
      // ids: {hash}  { key => '' }
      // this is provided by the Sub Class and has the keys
      // unique to the Sub Class' interface elements.

      var common = {
         component: "",
      };

      Object.keys(ids).forEach((k) => {
         if (typeof common[k] != "undefined") {
            console.error(
               `!!! ABViewEditorPlugin:: passed in ids contains a restricted field : ${k}`
            );
            return;
         }
         common[k] = "";
      });

      super(base, common);

      this.AB = view.AB;
      this.view = view;
      // {ABView}
      // The ABView instance this editor is editing

      this.settings = view?.settings || {};
      // {hash}
      // shortcut to reference the view's settings

      this.base = base;

      this.component = this.view.component(this.ids.component);
      // {ABComponent}
      // The component instance for this view.
      // Should be set via init() or component() method

      // Load the view to set CurrentViewID
      if (view) {
         this.viewLoad(view);
      }
   }

   /**
    * @method static key
    * Return the key identifier for this editor type.
    * NOTE: Sub classes should override this to return their specific key.
    * @return {string}
    */
   static get key() {
      return this.getPluginKey();
   }

   /**
    * @method ui()
    * Return the Webix UI definition for this editor.
    * NOTE: Sub classes should override this to provide their specific UI.
    * @return {object} Webix UI definition
    */
   ui() {
      // Default implementation - try to get UI from component
      if (this.component) {
         return typeof this.component.ui == "function"
            ? this.component.ui()
            : this.component.ui;
      }

      // Fallback: return a simple placeholder
      return {
         view: "template",
         template: `<div class="ab-view-editor-placeholder">${
            this.view?.label || "View Editor"
         }</div>`,
      };
   }

   /**
    * @method init()
    * Initialize the editor with the ABFactory instance.
    * @param {ABFactory} AB
    */
   async init(AB) {
      await super.init(AB);

      // Initialize the component if it has an init method
      if (this.component?.init) {
         return this.component.init(AB, 2);
         // in our editor, we provide accessLv = 2
      }
   }

   /**
    * @method detatch()
    * Detach the editor component.
    * Called when the editor is being removed or hidden.
    */
   detatch() {
      this.component?.detatch?.();
   }

   /**
    * @method onShow()
    * Called when the editor is shown.
    * Sub classes can override this to perform actions when the editor becomes visible.
    */
   onShow() {
      this.component?.onShow?.();
   }

   /**
    * @method onHide()
    * Called when the editor is hidden.
    * Sub classes can override this to perform actions when the editor becomes hidden.
    */
   onHide() {
      this.component?.onHide?.();
   }
}
