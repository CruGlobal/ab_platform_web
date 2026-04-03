export default function (ABViewFormItem) {
   const ABViewFormTextboxPropertyComponentDefaults = {
      type: "single", // 'single', 'multiple' or 'rich'
   };

   const ABViewFormTextboxDefaults = {
      key: "textbox", // {string} unique key for this view
      icon: "i-cursor", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.textbox", // {string} the multilingual label key for the class label
   };

   return class ABViewFormTextboxCore extends ABViewFormItem {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormTextboxDefaults
         );
      }

      static common() {
         return ABViewFormTextboxDefaults;
      }

      static defaultValues() {
         return ABViewFormTextboxPropertyComponentDefaults;
      }
   };
}
