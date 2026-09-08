export default function (ABViewFormCustom) {
   const ABViewFormTreePropertyComponentDefaults = {};

   const ABTreeDefaults = {
      key: "formtree", // {string} unique key for this view
      icon: "sitemap", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.tree", // {string} the multilingual label key for the class label
   };

   return class ABViewFormTreeCore extends ABViewFormCustom {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABTreeDefaults);
      }

      static common() {
         return ABTreeDefaults;
      }

      static defaultValues() {
         return ABViewFormTreePropertyComponentDefaults;
      }
   };
}
