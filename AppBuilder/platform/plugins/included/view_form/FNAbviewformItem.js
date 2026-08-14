import FNAbviewformItemComponent from "./viewComponent/FNAbviewformItemComponent.js";
import FNAbviewformItemCoreFactory from "./core/ABViewFormItemCore.js";

export default function FNAbviewformItem({
   ABViewComponentPlugin,
   ABViewPlugin,
}) {
   const ABViewFormItemCore = FNAbviewformItemCoreFactory(ABViewPlugin);
   const ABAbviewformItemComponent = FNAbviewformItemComponent({
      ABViewComponentPlugin,
   });

   const ABViewFormItem = class ABViewFormItem extends ABViewFormItemCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformItemComponent(this);
      }

      /**
       * @method parentFormUniqueID
       * return a unique ID based upon the closest form object this component is on.
       * @param {string} key  The basic id string we will try to make unique
       * @return {string}
       */
      parentFormUniqueID(key) {
         var form = this.parentFormComponent();
         var uniqueInstanceID;
         if (form) {
            uniqueInstanceID = form.uniqueInstanceID;
         } else {
            uniqueInstanceID = webix.uid();
         }

         return key + uniqueInstanceID;
      }
   };

   ABViewFormItem.ABViewFormItemComponent = ABAbviewformItemComponent;

   return ABViewFormItem;
}
