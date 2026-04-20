import FNAbviewformReadonlyComponent from "./viewComponent/FNAbviewformReadonlyComponent.js";
import FNAbviewformReadonlyCoreFactory from "./core/ABViewFormReadonlyCore.js";

export default function FNAbviewformReadonly({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormCustom,
   ABFieldImage,
   FocusableTemplate,
}) {
   const ABViewFormReadonlyCore =
      FNAbviewformReadonlyCoreFactory(ABViewFormCustom);
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
