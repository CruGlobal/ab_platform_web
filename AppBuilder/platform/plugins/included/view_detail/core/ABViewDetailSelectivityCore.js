export default function (ABViewDetailItem) {
   const ABViewDetailPropertyComponentDefaults = {
      height: 0,
   };

   const ABViewDefaults = {
      key: "detailselectivity", // {string} unique key for this view
      icon: "tasks", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.detail.selectivity", // {string} the multilingual label key for the class label
   };

   return class ABViewDetailSelectivityCore extends ABViewDetailItem {
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

      ///
      /// Instance Methods
      ///

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         // convert from "0" => 0
         this.settings.height = parseInt(
            this.settings.height ?? ABViewDetailPropertyComponentDefaults.height
         );
      }
   };
}
