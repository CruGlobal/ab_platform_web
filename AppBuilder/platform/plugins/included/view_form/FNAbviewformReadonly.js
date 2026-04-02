import FNAbviewformReadonlyComponent from "./viewComponent/FNAbviewformReadonlyComponent.js";

export default function FNAbviewformReadonly({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormReadonlyCore,
   ABFieldImage,
   FocusableTemplate,
}) {
   const ABAbviewformReadonlyComponent = FNAbviewformReadonlyComponent({
      ABViewFormItemComponent,
      ABFieldImage,
      FocusableTemplate,
   });

   return class ABViewFormReadonly extends ABViewFormReadonlyCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformReadonlyComponent(this);
      }
   };
}
