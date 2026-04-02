export default function FNAbviewformURL({
   ABAbviewformComponent,
   ABViewFormURLCore,
}) {
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
