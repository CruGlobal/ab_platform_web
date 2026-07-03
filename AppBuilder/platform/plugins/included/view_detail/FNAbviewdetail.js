import * as dComponents from "./DetailComponents.js";
import FNAbviewdetailComponent from "./viewComponent/FNAbviewdetailComponent.js";
import FNAbviewdetailCore from "./core/ABViewDetailCore.js";

export default function FNAbviewdetail(API) {
   const {
      ABViewComponentPlugin,
      ABViewPlugin,
      ABViewWidgetPlugin,
      ABViewContainer,
      ABViewContainerComponent,
      ABViewPropertyAddPage,
      AB,
   } = API;

   let DetailAPI = {
      AB,
      ABViewComponentPlugin,
      ABViewPlugin,
      ABViewPropertyAddPage,
      ABViewWidget: ABViewWidgetPlugin,
   };

   // 1. Initialize Base Item
   const { FNAbviewdetailItem, ...otherDComponents } = dComponents;

   DetailAPI.ABViewDetailItem = FNAbviewdetailItem(DetailAPI);

   // Store ABViewDetailItem for 'instanceof' checks in other plugins
   if (AB && AB.Class) {
      AB.Class.ABViewDetailItem = DetailAPI.ABViewDetailItem;
   }

   DetailAPI.ABViewDetailItemComponent =
      DetailAPI.ABViewDetailItem.ABViewDetailItemComponent;
   // 2. Initialize Custom/Sub classes
   const views = Object.values(otherDComponents).map((FNv) => FNv(DetailAPI));

   // 3. Main Detail View Component & Class
   const ABViewDetailComponent = FNAbviewdetailComponent(
      ABViewContainerComponent
   );
   const ABViewDetailCore = FNAbviewdetailCore(ABViewContainer);

   const ABViewDetail = class ABViewDetail extends ABViewDetailCore {
      static getPluginKey() {
         return this.common().key;
      }

      static getPluginType() {
         return "view";
      }

      /**
       * @method componentList
       * Return the list of components available on this view to display in the editor.
       */
      componentList() {
         const viewsToAllow = ["label", "text"];
         const allComponents = this.application.viewAll();
         return allComponents.filter((c) =>
            viewsToAllow.includes(c.common().key)
         );
      }

      addFieldToDetail(field, yPosition) {
         if (field == null) return;

         const newView = field
            .detailComponent()
            .newInstance(this.application, this);
         if (newView == null) return;

         newView.settings = newView.settings ?? {};
         newView.settings.fieldId = field.id;
         newView.settings.labelWidth =
            this.settings.labelWidth ||
            this.constructor.defaultValues().labelWidth;
         newView.settings.alias = field.alias;
         newView.position.y = yPosition;

         this._views.push(newView);
         return newView;
      }

      /**
       * @method component()
       * Return a UI component based upon this view.
       * @return {obj} UI component
       */
      component() {
         return new ABViewDetailComponent(this);
      }

      warningsEval() {
         super.warningsEval();

         const DC = this.datacollection;
         if (!DC) {
            this.warningsMessage(
               `can't resolve it's datacollection[${this.settings.dataviewID}]`
            );
         }
      }
   };

   views.push(ABViewDetail);

   return views;
}
