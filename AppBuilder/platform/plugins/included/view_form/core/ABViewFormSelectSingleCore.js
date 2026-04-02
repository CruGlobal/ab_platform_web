export default function (ABViewFormItemCore) {
   const ABViewFormSelectSinglePropertyComponentDefaults = {
      type: "richselect", // 'richselect' or 'radio'
   };

   const ABSelectSingleDefaults = {
      key: "selectsingle", // {string} unique key for this view
      icon: "list-ul", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.selectsingle", // {string} the multilingual label key for the class label
   };

   return class ABViewFormSelectSingleCore extends ABViewFormItemCore {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABSelectSingleDefaults
         );
      }

      static common() {
         return ABSelectSingleDefaults;
      }

      static defaultValues() {
         return ABViewFormSelectSinglePropertyComponentDefaults;
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
