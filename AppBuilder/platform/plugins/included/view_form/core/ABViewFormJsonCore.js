export default function (ABViewFormItemCore) {
   const ABViewFormJsonPropertyComponentDefaults = {
      type: "string", // 'string', 'systemObject' or 'filter'
   };

   const ABViewFormJsonDefaults = {
      key: "json", // {string} unique key for this view
      icon: "brackets-curly", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.json", // {string} the multilingual label key for the class label
   };

   return class ABViewFormJsonCore extends ABViewFormItemCore {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormJsonDefaults
         );
      }

      static common() {
         return ABViewFormJsonDefaults;
      }

      static defaultValues() {
         return ABViewFormJsonPropertyComponentDefaults;
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }
   };
}
