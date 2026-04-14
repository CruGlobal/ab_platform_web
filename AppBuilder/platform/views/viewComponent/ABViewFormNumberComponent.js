import ABViewFormItemComponent from "./ABViewFormItemComponent";
import NumberTextInput from "../../../../webix_custom_components/numbertext";

export default class ABViewFormNumberComponent extends (
   ABViewFormItemComponent
) {
   constructor(baseView, idBase, ids) {
      super(baseView, idBase || `ABViewFormNumber_${baseView.id}`, ids);

      this._numberTextInputKey = null;
   }

   get numberTextInputKey() {
      return (this._numberTextInputKey =
         this._numberTextInputKey || new NumberTextInput(this.AB._App).key);
   }

   ui() {
      return super.ui({
         view: this.settings.isStepper ? "counter" : this.numberTextInputKey,
         type: "number",
         validate: (val) => !isNaN(val * 1),
      });
   }
};
