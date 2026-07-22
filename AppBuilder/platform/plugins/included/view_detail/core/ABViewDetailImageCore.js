export default function (ABViewDetailItem) {
   const ABViewDetailImagePropertyComponentDefaults = {
      height: 80,
      width: 120,
   };

   const ABViewDetailImageDefaults = {
      key: "detailimage", // {string} unique key for this view
      icon: "image", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.detail.image", // {string} the multilingual label key for the class label
   };

   return class ABViewDetailImageCore extends ABViewDetailItem {
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
            defaultValues ?? ABViewDetailImageDefaults
         );
      }

      static common() {
         return ABViewDetailImageDefaults;
      }

      static defaultValues() {
         return ABViewDetailImagePropertyComponentDefaults;
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
            this.settings.height ||
               ABViewDetailImagePropertyComponentDefaults.height
         );
         this.settings.width = parseInt(
            this.settings.width ??
               ABViewDetailImagePropertyComponentDefaults.width
         );
      }
   };
}
