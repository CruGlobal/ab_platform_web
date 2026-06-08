import FNAbviewcommentComponent from "./FNAbviewcommentComponent.js";

// FNAbviewcomment Web
// A web side import for an ABView.
//
export default function FNAbviewcomment({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer,
}) {
   const ABAbviewcommentComponent = FNAbviewcommentComponent({
      ABViewComponentPlugin,
   });

   const ABViewCommentPropertyComponentDefaults = {
      dataviewID: null,
      columnUser: null,
      columnComment: null,
      columnDate: null,
      height: 300,
      label: "", // label is required and you can add more if the component needs them
      // format:0  	// 0 - normal, 1 - title, 2 - description
   };

   const ABViewDefaults = {
      key: "comment", // {string} unique key for this view
      icon: "comments", // {string} fa-[icon] reference for this view
      labelKey: "Comment", // {string} the multilingual label key for the class label
   };

   class ABViewCommentCore extends ABViewWidgetPlugin {
      constructor(values, application, parent, defaultValues) {
         super(values, application, parent, defaultValues || ABViewDefaults);
      }

      static common() {
         return ABViewDefaults;
      }

      static defaultValues() {
         return ABViewCommentPropertyComponentDefaults;
      }

      ///
      /// Instance Methods
      ///

      /**
       * @method fromValues()
       *
       * initialze this object with the given set of values.
       * @param {obj} values
       */
      fromValues(values) {
         super.fromValues(values);

         // convert from "0" => 0
         // this.settings.format = parseInt(this.settings.format);
         // if this is being instantiated on a read from the Property UI,
         this.settings.height = parseInt(this.settings.height || 0);
      }

      /**
       * @method componentList
       * return the list of components available on this view to display in the editor.
       */
      componentList() {
         return [];
      }

      getCurrentUserId() {
         const userObject = this.getUsers();
         const currentUser = this.AB.Account.username();
         //Anonymous User = 0

         if (!userObject) return;

         return userObject.findIndex((e) => e.value === currentUser) + 1;
      }

      getUsers() {
         return this.AB.Account.userList().map((e) => {
            return {
               id: e.username,
               value: e.username,
               image: e.image_id,
            };
         });
      }

      getUserField() {
         var dv = this.datacollection;
         if (!dv) return null;

         var obj = dv.datasource;
         if (!obj) return null;

         return obj.fieldByID(this.settings.columnUser);
      }

      getCommentField() {
         var dv = this.datacollection;
         if (!dv) return null;

         var obj = dv.datasource;
         if (!obj) return null;

         return obj.fieldByID(this.settings.columnComment);
      }

      getDateField() {
         var dv = this.datacollection;
         if (!dv) return null;

         var obj = dv.datasource;
         if (!obj) return null;

         return obj.fieldByID(this.settings.columnDate);
      }

      getUserData() {
         let UserImageField = this.AB.objectUser().fieldByID(
            "6383ce19-b344-44ee-87e6-decced7361f8"
         );

         var userObject = this.getUsers();
         var userList = [];

         if (!userObject) return;

         userObject.forEach((item, index) => {
            var imageURL = "";
            if (item.image) {
               imageURL = UserImageField.urlImage(item.image);
            }
            var user = { id: index + 1, value: item.value, image: imageURL };
            userList.push(user);
         });
         return userList;
      }

      model() {
         let dv = this.datacollection;
         if (!dv) return null; // TODO: refactor in v2

         // get ABModel
         let model = dv.model; // already notified
         if (!model) return null;

         return model;
      }
   }

   return class ABViewComment extends ABViewCommentCore {
      /**
       * @method getPluginKey
       * return the plugin key for this view.
       * @return {string} plugin key
       */
      static getPluginKey() {
         return this.common().key;
      }

      /**
       * @method component()
       * return a UI component based upon this view.
       * @return {obj} UI component
       */
      component(parentId) {
         return new ABAbviewcommentComponent(this, parentId);
      }

      // constructor(values, application, parent, defaultValues) {
      //    super(values, application, parent, defaultValues);
      // }

      warningsEval() {
         super.warningsEval();

         let field = this.getUserField();
         if (!field) {
            this.warningsMessage(
               `can't resolve user field[${this.settings.columnUser}]`
            );
         }

         field = this.getCommentField();
         if (!field) {
            this.warningsMessage(
               `can't resolve comment field[${this.settings.columnComment}]`
            );
         }

         field = this.getDateField();
         if (!field) {
            this.warningsMessage(
               `can't resolve date field[${this.settings.columnDate}]`
            );
         }
      }
   };
}
