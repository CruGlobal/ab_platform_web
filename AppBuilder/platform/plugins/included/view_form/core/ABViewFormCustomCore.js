export default function (ABViewFormItemCore) {
   const ABViewFormCustomPropertyComponentDefaults = {};

   const ABViewFormCustomDefaults = {
      key: "fieldcustom",
      // {string} unique key for this view
      icon: "object-group",
      // {string} fa-[icon] reference for this view
      labelKey: "ab.components.custom",
      // {string} the multilingual label key for the class label
   };

   return class ABViewFormCustom extends ABViewFormItemCore {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormCustomDefaults
         );
      }

      static common() {
         return ABViewFormCustomDefaults;
      }

      static defaultValues() {
         return ABViewFormCustomPropertyComponentDefaults;
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
