import FNAbviewformSelectMultipleComponent from "./viewComponent/FNAbviewformSelectMultipleComponent.js";

export default function FNAbviewformSelectMultiple({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormSelectMultipleCore,
}) {
   if (!ABViewFormItemComponent) {
      const error = new Error(
         "ABViewFormSelectMultiple: ABViewFormItemComponent is undefined"
      );
      console.error(error);
      return null;
   }

   const ABAbviewformSelectMultipleComponent =
      FNAbviewformSelectMultipleComponent({
         ABViewFormItemComponent,
      });

   return class ABViewFormSelectMultiple extends ABViewFormSelectMultipleCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformSelectMultipleComponent(this);
      }
   };
}
