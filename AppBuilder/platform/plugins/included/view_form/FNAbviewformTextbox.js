import FNAbviewformTextboxComponent from "./viewComponent/FNAbviewformTextboxComponent.js";

export default function FNAbviewformTextbox({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormTextboxCore,
}) {
   const ABAbviewformTextboxComponent = FNAbviewformTextboxComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormTextbox extends ABViewFormTextboxCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformTextboxComponent(this);
      }
   };
}
