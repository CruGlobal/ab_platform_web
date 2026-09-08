export default function (ABViewFormCustom) {
   const ABViewFormReadonlyPropertyComponentDefaults = {};

   const ABViewFormReadonlyDefaults = {
      key: "fieldreadonly", // {string} unique key for this view
      icon: "eye", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.readonly", // {string} the multilingual label key for the class label
   };

   return class ABViewFormReadonly extends ABViewFormCustom {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormReadonlyDefaults
         );
      }

      static common() {
         return ABViewFormReadonlyDefaults;
      }

      static defaultValues() {
         return ABViewFormReadonlyPropertyComponentDefaults;
      }
   };
}
