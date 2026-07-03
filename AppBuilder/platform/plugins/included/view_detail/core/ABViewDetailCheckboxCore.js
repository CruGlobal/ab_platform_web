export default function (ABViewDetailItem) {
   const ABViewDetailCheckboxPropertyComponentDefaults = {};

   const ABViewDetailCheckboxDefaults = {
      key: "detailcheckbox", // {string} unique key for this view
      icon: "check-square-o", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.detail.checkbox", // {string} the multilingual label key for the class label
   };

   return class ABViewDetailCheckboxCore extends ABViewDetailItem {
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
            defaultValues ?? ABViewDetailCheckboxDefaults
         );
      }

      static common() {
         return ABViewDetailCheckboxDefaults;
      }

      static defaultValues() {
         return ABViewDetailCheckboxPropertyComponentDefaults;
      }
   };
}
