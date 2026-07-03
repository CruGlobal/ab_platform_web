export default function (ABViewDetailItem) {
   const ABViewDetailPropertyComponentDefaults = {
      formView: "", // id of form to add new data
   };

   const ABViewDefaults = {
      key: "detailconnect", // {string} unique key for this view
      icon: "list-ul", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.detail.connect", // {string} the multilingual label key for the class label
   };

   return class ABViewDetailConnectCore extends ABViewDetailItem {
      /**
       * @param {obj} values  key=>value hash of ABView values
       * @param {ABApplication} application the application object this view is under
       * @param {ABView} parent the ABView this view is a child of. (can be null)
       */
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues ?? ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewDetailPropertyComponentDefaults;
      }
   };
}
