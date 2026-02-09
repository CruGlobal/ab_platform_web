import FNAbviewtextComponent from "./FNAbviewtextComponent.js";


// FNAbviewtext Web
// A web side import for an ABView.
//
export default function FNAbviewtext({
   /*AB,*/
   ABViewWidgetPlugin,
   ABViewComponentPlugin,
   ABViewContainer
}) {
   const ABAbviewtextComponent = FNAbviewtextComponent({ ABViewComponentPlugin });

const ABViewTextPropertyComponentDefaults = {
   text: "",
   // {string}
   // A multilingual text template that is used to display a given set of
   // values.

   height: 0,
   // {integer}
   // The default height of this widget.

   dataviewID: null,
   // {uuid}
   // The {ABDataCollection.id} of the datacollection this ABViewText is
   // pulling data from.
   // In most usage situations this ABView is tied to the data in an
   // ABDataCollection.  However, it is possible for an ABObject to be
   // directly assigned to the ABView, and that will be used instead.
};

const ABViewDefaults = {
   key: "text",
   // {string}
   // unique key for this view

   icon: "font",
   // {string}
   // fa-[icon] reference for this view

   labelKey: "Text",
   // {string}
   // the multilingual label key for the class label
};

class ABViewTextCore extends ABViewWidgetPlugin {
   constructor(values, application, parent, defaultValues) {
      super(values, application, parent, defaultValues || ABViewDefaults);

      this._object = null;
   }

   static common() {
      return ABViewDefaults;
   }

   static defaultValues() {
      return ABViewTextPropertyComponentDefaults;
   }

   ///
   /// Instance Methods
   ///

   /**
    * @method toObj()
    *
    * properly compile the current state of this ABViewLabel instance
    * into the values needed for saving.
    *
    * @return {json}
    */
   toObj() {
      // NOTE: ABView auto translates/untranslates "label"
      // add in any additional fields here:
      this.unTranslate(this, this, ["text"]);

      var obj = super.toObj();
      obj.views = [];
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

      this.settings = this.settings || {};

      // convert from "0" => 0
      this.settings.height = parseInt(
         this.settings.height || ABViewTextPropertyComponentDefaults.height
      );

      // if this is being instantiated on a read from the Property UI,
      this.text = values.text || ABViewTextPropertyComponentDefaults.text;

      // NOTE: ABView auto translates/untranslates "label"
      // add in any additional fields here:
      this.translate(this, this, ["text"]);
   }

   /**
    * @method componentList
    * return the list of components available on this view to display in the editor.
    */
   componentList() {
      return [];
   }

   /**
    * @property datacollection
    * return ABDatacollection of this form
    *
    * @return {ABDatacollection}
    */
   get datacollection() {
      if (this.parent?.key == "dataview") {
         return this.AB.datacollectionByID(this.parent.settings.dataviewID);
      } else {
         return this.AB.datacollectionByID(this.settings.dataviewID);
      }
   }

   fieldKey(field) {
      let label = field.label || "";
      label = label.replace(/\(/g, "\\(");
      label = label.replace(/\)/g, "\\)");
      return label;
   }

   displayText(val, componentID) {
      var result = this.text;

      let clearTemplateValue = (result) => {
         return result.replace(/{(.*?)}/g, "");
      };

      var dv = this.datacollection;
      // if (!dv) return clearTemplateValue(result);

      var object = dv?.datasource ?? this._object;
      if (!object) return clearTemplateValue(result);

      const rowData = val || dv.getCursor() || {};

      object.fields().forEach((f) => {
         // add \\ in front of the regular expression special charactors
         // let label = f.label || "";
         // label = label.replace(/\(/g, "\\(");
         // label = label.replace(/\)/g, "\\)");
         let label = this.fieldKey(f);

         var template = new RegExp("{" + label + "}", "g");

         // IDEA: I'd like to keep all the image url logic INSIDE the ABFieldImage
         // object.  Is there some way we can simply call: f.imageTemplate(rowData)
         // and parse the results for the url to display here?

         var data = f.format(rowData);
         if (f.key == "image") {
            var fData = data;
            data = f.urlImage(fData);

            // Question: should we change f.urlImage() to return the defaultImageUrl
            // if fData is "" and .useDefaultImage = true?

            if (
               !fData &&
               f.settings.defaultImageUrl &&
               f.settings.useDefaultImage
            ) {
               data = f.urlImage(f.settings.defaultImageUrl);

               ////
               //// James:  Revisit this and make sure we are handling things ok now.
               // result = result.replace(
               //    "img",
               //    'img onload=\'AD.comm.hub.publish("component.adjust", {"containerID": "' +
               //       componentID +
               //       "\"});' "
               // );
               // } else if (
               //    fData != "" &&
               //    result.indexOf("onload") == -1 &&
               //    componentID
               // ) {
               // result = result.replace(
               //    "img",
               //    'img onload=\'AD.comm.hub.publish("component.adjust", {"containerID": "' +
               //       componentID +
               //       "\"});' "
               // );
            } else {
               ////
               //// James: It looks like this routine assumes the this.text template will
               //// only have 1 <img> tag in it.  Is that necessarilly true?
               ////
               //// If NOT, then we need to rethink this next line:

               result = result.replace(
                  "img",
                  "img onerror='this.parentNode.removeChild(this);' "
               );
            }
         }

         result = result.replace(template, data);
      });

      // Support {uuid} tag in tempalte
      result = result.replace(/{PK}/g, rowData[object.PK()]);

      return result;
   }

   objectLoad(object) {
      this._object = object;
   }
};



return class ABViewText extends ABViewTextCore {

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
         return new ABAbviewtextComponent(this, parentId);
      }


   
};

}

