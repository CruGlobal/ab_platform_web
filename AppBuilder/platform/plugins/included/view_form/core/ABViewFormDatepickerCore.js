export default function (ABViewFormItemCore) {
   const ABViewFormDatepickerPropertyComponentDefaults = {
      timepicker: false,
   };

   const ABViewFormDatepickerDefaults = {
      key: "datepicker", // {string} unique key for this view
      icon: "calendar", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.datepicker", // {string} the multilingual label key for the class label
   };

   return class ABViewFormDatepickerCore extends ABViewFormItemCore {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormDatepickerDefaults
         );
      }

      static common() {
         return ABViewFormDatepickerDefaults;
      }

      static defaultValues() {
         return ABViewFormDatepickerPropertyComponentDefaults;
      }

      ///
      /// Instance Methods
      ///

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   };
}
