import FNAbviewformButtonComponent from "./viewComponent/FNAbviewformButtonComponent.js";
import FNAbviewformButtonCoreFactory from "./core/ABViewFormButtonCore.js";

export default function FNAbviewformButton({
   ABViewComponentPlugin,
   ABViewPlugin,
   ABViewFormItemComponent,
}) {
   const ABViewFormButtonCore = FNAbviewformButtonCoreFactory(ABViewPlugin);

   if (!ABViewFormItemComponent) {
      const error = new Error(
         "ABViewFormButton: ABViewFormItemComponent is undefined"
      );
      console.error(error);
      return null;
   }

   const ABAbviewformButtonComponent = FNAbviewformButtonComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormButton extends ABViewFormButtonCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformButtonComponent(this);
      }
   };
}
