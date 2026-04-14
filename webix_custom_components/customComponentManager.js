/*
 * Custom Component Manager
 * Make sure our {ABComponent}s are initialized with our custom
 * Webix Components.
 */

// Import our Custom Components here:
import ABCustomActiveList from "./activelist.js";
import ABCustomCountFooter from "./countfooter.js";
import ABCustomDatetimePicker from "./datetimepicker.js";
import ABCustomEditList from "./editlist.js";
import ABCustomEditTree from "./edittree.js";
import ABCustomEditUnitList from "./editunitlist.js";
import ABCustomFocusableTemplate from "./focusableTemplate.js";
import ABCustomFormIOPreview from "./formioPreview.js";
import ABCustomFormBuilder from "./formioBuilder.js";
import ABCustomNumberText from "./numbertext.js";
import ABCustomThaiCalendar from "./thaicalendar.js";
import ABCustomTimePicker from "./timepicker.js";
import ABCustomTinyMCE from "./tinyMce.js";
import ABCustomTotalFooter from "./totalfooter.js";
import ABCustomTreeSuggest from "./treesuggest.js";
// import './savablelayout'

const componentList = [
   ABCustomActiveList,
   ABCustomCountFooter,
   ABCustomDatetimePicker,
   ABCustomEditList,
   ABCustomEditTree,
   ABCustomEditUnitList,
   ABCustomFocusableTemplate,
   ABCustomFormIOPreview,
   ABCustomFormBuilder,
   ABCustomNumberText,
   ABCustomThaiCalendar,
   ABCustomTimePicker,
   ABCustomTinyMCE,
   ABCustomTotalFooter,
   ABCustomTreeSuggest,
];

export default class ABCustomComponentManager {
   constructor() {}

   initComponents(App) {
      App.custom = App.custom || {};

      componentList.forEach((Component) => {
         var component = new Component(App);
         App.custom[component.key] = component;
      });

      // Transition to v2:
      App.AB.custom = App.custom;
   }
}
