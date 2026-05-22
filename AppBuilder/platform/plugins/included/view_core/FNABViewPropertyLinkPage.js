import FNABViewProperty from "./FNABViewProperty.js";

export default function FNABViewPropertyLinkPage({
   ABUIPlugin,
   ABViewPlugin,
   ABViewComponentPlugin,
}) {
   const ABViewProperty = FNABViewProperty({ ABUIPlugin });

   class ABViewPropertyLinkPageComponent extends ABViewComponentPlugin {
      constructor(linkPageHelper, idBase) {
         let base = idBase || `ABViewPropertyLinkPage_xxx`;
         super(base, {});

         this.linkPageHelper = linkPageHelper;
         this.AB = linkPageHelper.AB;

         this.view = null;
         this.datacollection = null;
      }

      ui() {
         return {};
      }

      init(options) {
         if (options.view) this.view = options.view;

         if (options.datacollection)
            this.datacollection = options.datacollection;
      }

      changePage(pageId, rowId) {
         if (this.datacollection) {
            this.datacollection.once("changeCursor", () => {
               this.view?.changePage(pageId);
            });
            this.datacollection.setCursor(rowId);
         } else {
            this.view?.changePage(pageId);
         }
      }
   }

   return class ABViewPropertyLinkPage extends ABViewProperty {
      /** == UI == */
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      component(v1App = false) {
         let component = new ABViewPropertyLinkPageComponent(this);

         if (v1App) {
            var newComponent = component;
            component = {
               ui: newComponent.ui(),
               init: (...params) => {
                  return newComponent.init(...params);
               },
               onShow: (...params) => {
                  return newComponent.onShow?.(...params);
               },
               changePage: (...params) => {
                  return newComponent.changePage(...params);
               },
            };
         }

         return component;
      }
   };
}
