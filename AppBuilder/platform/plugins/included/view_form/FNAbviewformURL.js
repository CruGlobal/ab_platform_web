import FNAbviewformURLCoreFactory from "./core/ABViewFormURLCore.js";

export default function FNAbviewformURL({ ABAbviewformComponent, ABViewForm }) {
   const ABViewFormURLCore = FNAbviewformURLCoreFactory(ABViewForm);

   return class ABViewFormURL extends ABViewFormURLCore {
      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABAbviewformComponent(this);
      }
   };
}
