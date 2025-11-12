import ClassUI from "../../../ui/ClassUI.js";

export default class ABClassUIPlugin extends ClassUI {
   constructor(base = "class_ui", ids = {}) {
      // base: {string} unique base id reference
      // ids: {hash}  { key => '' }
      // this is provided by the Sub Class and has the keys
      // unique to the Sub Class' interface elements.

      super(base, ids);

      this.base = base;

      this.AB = null;
      // {ABFactory}
      // Our common ABFactory for our application.
      // Should be set via init(AB) method

      this.CurrentApplicationID = null;
      // {string} uuid
      // The current ABApplication.id we are working with.

      this.CurrentDatacollectionID = null;
      // {string}
      // the ABDataCollection.id of the datacollection we are working with.

      this.CurrentObjectID = null;
      // {string}
      // the ABObject.id of the object we are working with.

      this.CurrentProcessID = null;
      // {string}
      // the ABProcess.id of the process we are working with.

      this.CurrentQueryID = null;
      // {string}
      // the ABObjectQuery.id of the query we are working with.

      this.CurrentViewID = null;
      // {string}
      // the ABView.id of the view we are working with.

      this.CurrentVersionID = null;
      // {string}
      // the ABVersion.id of the version we are working with.
   }

   /**
    * @method static L()
    * A static method to return a multilingual label function.
    * NOTE: Sub classes should override this to provide their plugin name.
    * @return {function} A function that returns multilingual labels
    */
   // static L() {
   //    return function (...params) {
   //       // Default implementation - sub classes should override
   //       return params[0] || "";
   //    };
   // }

   /**
    * @function applicationLoad
    * save the ABApplication.id of the current application.
    * @param {ABApplication} app
    */
   applicationLoad(app) {
      this.CurrentApplicationID = app?.id;
   }

   /**
    * @function datacollectionLoad
    * save the ABDataCollection.id of the current datacollection.
    * @param {ABDataCollection} dc
    */
   datacollectionLoad(dc) {
      this.CurrentDatacollectionID = dc?.id;
   }

   /**
    * @function objectLoad
    * save the ABObject.id of the current object.
    * @param {ABObject} obj
    */
   objectLoad(obj) {
      this.CurrentObjectID = obj?.id;
   }

   /**
    * @function processLoad
    * save the ABProcess.id of the current process.
    * @param {ABProcess} process
    */
   processLoad(process) {
      this.CurrentProcessID = process?.id;
   }

   /**
    * @function queryLoad
    * save the ABObjectQuery.id of the current query.
    * @param {ABObjectQuery} query
    */
   queryLoad(query) {
      this.CurrentQueryID = query?.id;
   }

   /**
    * @function versionLoad
    * save the ABVersion.id of the current version.
    * @param {ABVersion} version
    */
   versionLoad(version) {
      this.CurrentVersionID = version?.id;
   }

   /**
    * @function viewLoad
    * save the ABView.id of the current view.
    * @param {ABView} view
    */
   viewLoad(view) {
      this.CurrentViewID = view?.id;

      if (view?.application) {
         this.applicationLoad(view.application);
      }
   }

   /**
    * @method CurrentApplication
    * return the current ABApplication being worked on.
    * @return {ABApplication} application
    */
   get CurrentApplication() {
      return this.AB?.applicationByID(this.CurrentApplicationID);
   }

   /**
    * @method CurrentDatacollection()
    * A helper to return the current ABDataCollection we are working with.
    * @return {ABDataCollection}
    */
   get CurrentDatacollection() {
      return this.AB?.datacollectionByID(this.CurrentDatacollectionID);
   }

   /**
    * @method CurrentObject()
    * A helper to return the current ABObject we are working with.
    * @return {ABObject}
    */
   get CurrentObject() {
      let obj = this.AB?.objectByID(this.CurrentObjectID);
      if (!obj) {
         obj = this.AB?.queryByID(this.CurrentObjectID);
      }
      return obj;
   }

   /**
    * @method CurrentProcess()
    * A helper to return the current ABProcess we are working with.
    * @return {ABProcess}
    */
   get CurrentProcess() {
      return this.AB?.processByID(this.CurrentProcessID);
   }

   /**
    * @method CurrentQuery()
    * A helper to return the current ABObjectQuery we are working with.
    * @return {ABObjectQuery}
    */
   get CurrentQuery() {
      return this.AB?.queryByID(this.CurrentQueryID);
   }

   /**
    * @method CurrentView()
    * A helper to return the current ABView we are working with.
    * @return {ABView}
    */
   get CurrentView() {
      return this.CurrentApplication?.views(
         (v) => v.id == this.CurrentViewID
      )[0];
   }

   /**
    * @method CurrentVersion()
    * A helper to return the current ABVersion we are working with.
    * @return {ABVersion}
    */
   // get CurrentVersion() {
   //    return this.AB?.versionByID?.(this.CurrentVersionID);
   // }

   /**
    * @method datacollectionsIncluded()
    * return a list of datacollections that are included in the current
    * application.
    * @return [{id, value, icon}]
    *         id: {string} the ABDataCollection.id
    *         value: {string} the label of the ABDataCollection
    *         icon: {string} the icon to display
    */
   datacollectionsIncluded() {
      return this.CurrentApplication?.datacollectionsIncluded()
         .filter((dc) => {
            const obj = dc.datasource;
            return (
               dc.sourceType == "object" && !obj?.isImported && !obj?.isReadOnly
            );
         })
         .map((d) => {
            let entry = { id: d.id, value: d.label };
            if (d.sourceType == "query") {
               entry.icon = "fa fa-filter";
            } else {
               entry.icon = "fa fa-database";
            }
            return entry;
         });
   }

   /**
    * @method uniqueIDs()
    * add a unique identifier to each of our this.ids to ensure they are
    * unique.  Useful for components that are repeated, like items in a list.
    */
   uniqueIDs() {
      let uniqueInstanceID = webix.uid();
      Object.keys(this.ids).forEach((k) => {
         this.ids[k] = `${this.ids[k]}_${uniqueInstanceID}`;
      });
   }

   /**
    * @method warningsRefresh()
    * reset the warnings on the provided ABObject and then start propogating
    * the "warnings" display updates.
    * @param {ABObject} ABObject
    */
   warningsRefresh(ABObject) {
      ABObject?.warningsEval?.();
      this.emit("warnings");
   }

   /**
    * @method warningsPropogate()
    * If any of the passed in ui elements issue a "warnings" event, we will
    * propogate that upwards.
    * @param {Array} elements
    *        Array of UI elements that can emit "warnings" events
    */
   warningsPropogate(elements = []) {
      elements.forEach((e) => {
         e.on("warnings", () => {
            this.emit("warnings");
         });
      });
   }

   /**
    * @method init()
    * Initialize the plugin with the ABFactory instance.
    * @param {ABFactory} AB
    */
   async init(AB) {
      this.AB = AB;
   }
}
