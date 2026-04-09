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
         const dc = this.datacollection;
         const cur = dc.getCursor();
         const same =
            cur &&
            (String(cur.id) === String(rowId) ||
               String(cur.uuid) === String(rowId));
         // If cursor is already on this row, changeCursor may not fire; navigate immediately
         // so Cypress and slow CI do not hang waiting for a one-time listener.
         if (same) {
            this.view?.changePage(pageId);
            return;
         }
         dc.once("changeCursor", () => {
            this.view?.changePage(pageId);
         });
         dc.setCursor(rowId);
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
