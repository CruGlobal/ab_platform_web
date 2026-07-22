export default function (ABViewDetailItem) {
   const ABViewDetailCustomPropertyComponentDefaults = {};

   const ABViewDetailCustomDefaults = {
      key: "detailcustom", // {string} unique key for this view
      icon: "dot-circle-o", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.detail.custom", // {string} the multilingual label key for the class label
   };

   return class ABViewDetailCustomCore extends ABViewDetailItem {
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
            defaultValues ?? ABViewDetailCustomDefaults
         );
      }

      static common() {
         return ABViewDetailCustomDefaults;
      }

      static defaultValues() {
         return ABViewDetailCustomPropertyComponentDefaults;
      }
   };
}
