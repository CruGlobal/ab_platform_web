export default function FNAbviewLabelComponent({
   // AB,
   ABViewComponentPlugin,
}) {
   return class ABViewLabelComponent extends ABViewComponentPlugin {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewLabel_${baseView.id}`,
            Object.assign(
               {
                  template: "",
               },
               ids,
            ),
         );
      }

      /**
       * @method ui
       * return the Webix UI definition for this component.
       * @return {object} Webix UI definition
       */
      ui() {
         const baseView = this.view
         baseView.text = baseView.text || this.view.settings.text
         this.settings = this.view.settings

         const _ui = super.ui([
            this.uiFormatting({
               view: "label",
               label: baseView.text || "*",
               align: this.settings.alignment,
               type: {
                  height: "auto",
               },
            }),
         ]);

         delete _ui.type;

         return _ui;
      }
      /**
       * @method uiFormatting
       * a common routine to properly update the displayed label
       * UI with the css formatting for the given .settings
       * @param {obj} _ui the current webix.ui definition
       * @return {obj} a properly formatted webix.ui definition
       */
      uiFormatting(ui) {
         // add different css settings based upon it's format
         // type.
         this.settings = this.view.settings
         switch (parseInt(this.settings.format)) {
            // normal
            case 0:
               ui.css = "ab-component-label ab-ellipses-text";
               break;

            // title
            case 1:
               ui.css = "ab-component-header ab-ellipses-text";
               break;

            // description
            case 2:
               ui.css = "ab-component-description ab-ellipses-text";
               break;
         }

         return ui;
      }
      /**
       * @method onShow
       * called when the component is shown.
       * perform any additional initialization here.
       */
      onShow() {
         super.onShow();
      }
   };
}
