export default function (ABViewDetailItem) {
   const ABViewDetailPropertyComponentDefaults = {};

   const ABViewDetailTreeDefaults = {
      key: "detailtree", // {string} unique key for this view
      icon: "sitemap", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.detail.tree", // {string} the multilingual label key for the class label
   };

   return class ABViewDetailTreeCore extends ABViewDetailItem {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABView} parent the ABView this view is a child of. (can be null)
       */
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues ?? ABViewDetailTreeDefaults
         );
      }

      static common() {
         return ABViewDetailTreeDefaults;
      }

      static defaultValues() {
         return ABViewDetailPropertyComponentDefaults;
      }
   };
}
