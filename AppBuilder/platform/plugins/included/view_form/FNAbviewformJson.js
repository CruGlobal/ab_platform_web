import FNAbviewformJsonComponent from "./viewComponent/FNAbviewformJsonComponent.js";

export default function FNAbviewformJson({
   ABViewComponentPlugin,
   ABViewFormItemComponent,
   ABViewFormJsonCore,
}) {
   const ABAbviewformJsonComponent = FNAbviewformJsonComponent({
      ABViewFormItemComponent,
   });

   return class ABViewFormJson extends ABViewFormJsonCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformJsonComponent(this);
      }
   };
}
