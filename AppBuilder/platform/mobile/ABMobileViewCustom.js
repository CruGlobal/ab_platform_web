import ABMobileViewCustomCore from "../../core/mobile/ABMobileViewCustomCore";

export default class ABMobileViewCustom extends ABMobileViewCustomCore {
   // constructor(values, application, parent, defaultValues) {
   //    super(values, application, parent, defaultValues);
   // }
   warningsEval() {
      super.warningsEval();

      // Add in here any missing or unfindable setting reference
      // like datacollection ...
   }
};
