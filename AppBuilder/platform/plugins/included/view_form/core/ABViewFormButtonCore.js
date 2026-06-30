export default function (ABView) {
   const ABViewFormButtonPropertyComponentDefaults = {
      includeSave: true,
      saveLabel: "",
      includeCancel: false,
      cancelLabel: "",
      includeReset: false,
      resetLabel: "",
      includeDelete: false,
      deleteLabel: "",
      afterCancel: null,
      alignment: "right",
      isDefault: false, // mark default button of form widget
   };

   const ABViewFormButtonDefaults = {
      key: "button",
      // {string} unique key for this view

      icon: "square",
      // {string} fa-[icon] reference for this view

      labelKey: "ab.components.button",
      // {string} the multilingual label key for the class label
   };

   return class ABViewFormButtonCore extends ABView {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormButtonDefaults
         );
      }

      static common() {
         return ABViewFormButtonDefaults;
      }

      static defaultValues() {
         return ABViewFormButtonPropertyComponentDefaults;
      }

      ///
      /// Instance Methods
      ///

      toObj() {
         // labels are multilingual values:
         let labels = [];

         if (this.settings.saveLabel) labels.push("saveLabel");

         if (this.settings.cancelLabel) labels.push("cancelLabel");

         if (this.settings.resetLabel) labels.push("resetLabel");

         if (this.settings.deleteLabel) labels.push("deleteLabel");

         this.unTranslate(this.settings, this.settings, labels);

         let result = super.toObj();

         return result;
      }

      /**
       * @property datacollection
       * return data source
       * NOTE: this view doesn't track a DataCollection.
       * @return {ABDataCollection}
       */
      get datacollection() {
         return null;
      }

      fromValues(values) {
         super.fromValues(values);

         // labels are multilingual values:
         let labels = [];

         if (this.settings.saveLabel) labels.push("saveLabel");

         if (this.settings.cancelLabel) labels.push("cancelLabel");

         if (this.settings.resetLabel) labels.push("resetLabel");

         if (this.settings.deleteLabel) labels.push("deleteLabel");

         this.unTranslate(this.settings, this.settings, labels);

         this.settings.includeSave = JSON.parse(
            (this.settings?.includeSave ?? true) &&
               ABViewFormButtonPropertyComponentDefaults.includeSave
         );
         this.settings.includeCancel = JSON.parse(
            this.settings.includeCancel ||
               ABViewFormButtonPropertyComponentDefaults.includeCancel
         );
         this.settings.includeReset = JSON.parse(
            this.settings.includeReset ||
               ABViewFormButtonPropertyComponentDefaults.includeReset
         );
         this.settings.includeDelete = JSON.parse(
            this.settings.includeDelete ||
               ABViewFormButtonPropertyComponentDefaults.includeDelete
         );

         this.settings.isDefault = JSON.parse(
            this.settings.isDefault ||
               ABViewFormButtonPropertyComponentDefaults.isDefault
         );
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
