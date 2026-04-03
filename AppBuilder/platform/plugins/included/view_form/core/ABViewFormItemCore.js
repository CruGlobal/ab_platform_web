export default function (ABView) {
   const ABViewFormFieldPropertyComponentDefaults = {
      required: 0,
      disable: 0,
   };

   return class ABViewFormItemCore extends ABView {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues);
         this.isFormField = true;
      }

      static defaultValues() {
         return ABViewFormFieldPropertyComponentDefaults;
      }

      /**
       * @property datacollection
       * return data source
       * NOTE: this view doesn't track a DataCollection.
       * @return {ABDataCollection}
       */
      get datacollection() {
         let form = this.parentFormComponent();
         if (form == null) return null;

         let datacollection = form.datacollection;
         if (datacollection == null) return null;

         return datacollection;
      }

      field() {
         if (this.settings.objectId) {
            let object = this.AB.objectByID(this.settings.objectId);
            if (!object) return null;

            return object.fieldByID(this.settings.fieldId);
         } else {
            let form = this.parentFormComponent();
            if (form == null) return null;

            let object;
            if (form._currentObject) {
               object = form._currentObject;
            } else {
               let datacollection = form.datacollection;
               if (datacollection == null) return null;

               object = datacollection.datasource;
            }

            if (object == null) return null;

            let field = object.fieldByID(this.settings.fieldId);
            return field;
         }
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
