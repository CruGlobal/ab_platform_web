// Local copy of link-page helper logic so the plugin remains self-contained.
class ABViewPropertyLinkPageComponentLocal {
   constructor() {
      this.view = null;
      this.datacollection = null;
   }

   ui() {
      return {};
   }

   init(options = {}) {
      if (options.view) this.view = options.view;
      if (options.datacollection) this.datacollection = options.datacollection;
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

export default class ABViewPropertyLinkPageLocal {
   component(v1App = false) {
      const component = new ABViewPropertyLinkPageComponentLocal();

      if (!v1App) return component;

      return {
         ui: component.ui(),
         init: (...params) => component.init(...params),
         onShow: (...params) => component.onShow?.(...params),
         changePage: (...params) => component.changePage(...params),
      };
   }
}
