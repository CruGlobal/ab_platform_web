export default function (ABViewFormItemCore) {
   const ABViewFormSelectMultiplePropertyComponentDefaults = {
      type: "multicombo", // 'richselect' or 'radio'
   };

   const ABSelectMultipleDefaults = {
      key: "selectmultiple", // {string} unique key for this view
      icon: "list-ul", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.selectmultiple", // {string} the multilingual label key for the class label
   };

   return class ABViewFormSelectMultipleCore extends ABViewFormItemCore {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABSelectMultipleDefaults
         );
      }

      static common() {
         return ABSelectMultipleDefaults;
      }

      static defaultValues() {
         return ABViewFormSelectMultiplePropertyComponentDefaults;
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
