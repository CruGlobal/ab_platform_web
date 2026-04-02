import FNAbviewformCheckboxComponent from "./viewComponent/FNAbviewformCheckboxComponent.js";

export default function FNAbviewformCheckbox({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormCheckboxCore,
}) {
   const ABAbviewformCheckboxComponent = FNAbviewformCheckboxComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormCheckbox extends ABViewFormCheckboxCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformCheckboxComponent(this);
      }
   };
}
