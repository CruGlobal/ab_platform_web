export default function (ABViewFormItem) {
   const ABViewFormNumberPropertyComponentDefaults = {
      isStepper: 0,
   };

   const ABViewFormNumberDefaults = {
      key: "numberbox", // {string} unique key for this view
      icon: "hashtag", // {string} fa-[icon] reference for this view
      labelKey: "ab.components.number", // {string} the multilingual label key for the class label
   };

   return class ABViewFormNumberCore extends ABViewFormItem {
      constructor(values, application, parent, defaultValues) {
         super(
            values,
            application,
            parent,
            defaultValues || ABViewFormNumberDefaults
         );
      }

      static common() {
         return ABViewFormNumberDefaults;
      }

      static defaultValues() {
         return ABViewFormNumberPropertyComponentDefaults;
      }

      ///
      /// Instance Methods
      ///

      /**
       * @method toObj()
       *
       * properly compile the current state of this ABViewFormText instance
       * into the values needed for saving.
       *
       * @return {json}
       */
      toObj() {
         this.unTranslate(this, this, ["label", "formLabel"]);

         var obj = super.toObj();
         obj.views = []; // no subviews
         return obj;
      }

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         // if this is being instantiated on a read from the Property UI,
         this.settings.isStepper =
            this.settings.isStepper ||
            ABViewFormNumberPropertyComponentDefaults.isStepper;

         // convert from "0" => 0
         this.settings.isStepper = parseInt(this.settings.isStepper);
      }
   };
}
