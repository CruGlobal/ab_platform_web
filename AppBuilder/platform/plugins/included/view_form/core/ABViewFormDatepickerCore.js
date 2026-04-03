export default function (ABViewFormItem) {
   const ABViewFormDatepickerPropertyComponentDefaults = {
      timepicker: false,
   };

   const ABViewFormDatepickerDefaults = {
      key: "datepicker", // {string} unique key for this view
      icon: "calendar", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.datepicker", // {string} the multilingual label key for the class label
   };

   return class ABViewFormDatepickerCore extends ABViewFormItem {
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
   };
}
