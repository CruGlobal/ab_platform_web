import ClassUI from "./ClassUI.js";

class PortalWorkTaskUserForm extends ClassUI {
   constructor() {
      super("portal_work_task_user_form", {
         formIO: "",
      });
   }

   ui() {
      const ids = this.ids;

      return {
         id: ids.component,
         view: "window",
         height: 500,
         width: 600,
         position: "center",
         modal: true,
         move: true,
         resize: true,
         head: {
            view: "toolbar",
            css: "webix_dark",
            cols: [
               {
                  css: { cursor: "move" },
               },
               // {
               //    view: "label",
               //    label: this.label(""),
               //    autowidth: true,
               // },
               // {},
               {
                  view: "button",
                  width: 35,
                  css: "webix_transparent",
                  type: "icon",
                  icon: "nomargin fa fa-times",
                  click: () => {
                     this.hide();
                  },
               },
            ],
         },
         body: {
            view: "layout",
            padding: 10,
            rows: [this.uiFormIO()],
         },
      };
   }

   uiFormIO(
      processId,
      taskId,
      instanceId,
      formComponents = { components: [] },
      formData
   ) {
      const ids = this.ids;
      const _this = this;

      return {
         id: ids.formIO,
         view: "formiopreview",
         processId,
         taskId,
         instanceId,
         formComponents: formComponents,
         formData,
         onButton: function () {
            _this.submitData(this.processId, this.taskId, this.instanceId);
         },
      };
   }

   refreshFormIO(
      processId,
      taskId,
      instanceId,
      formComponents = { components: [] },
      formData
   ) {
      const ids = this.ids;
      const formIoDef = this.uiFormIO(
         processId,
         taskId,
         instanceId,
         formComponents,
         formData
      );

      this.AB.Webix.ui(formIoDef, $$(ids.formIO));
   }

   init(AB) {
      const ui = this.ui();

      this.AB = AB;
      this.AB.custom.formiopreview.init();
      this.AB.Webix.ui(ui);
      this.AB.on("ab.task.userform", (data) => {
         this.refreshFormIO(
            data.processId,
            data.taskId,
            data.instanceId,
            data.formio,
            data.formData
         );
         this.show();
      });
   }

   show() {
      const $popup = $$(this.ids.component);
      try {
         $popup?.show();
      } catch {
         // Catch the error i.render is not function.
      }
   }

   hide() {
      const $popup = $$(this.ids.component);
      $popup?.hide();
   }

   submitData(processID, taskID, instanceID) {
      const ids = this.ids;
      const values = $$(ids.formIO)?._formio?.instance?.data ?? null;
      if (!values) return;

      this.AB.Network.post({
         url: `/process/userform/${processID}/${taskID}`,
         data: {
            instanceID,
            values,
         },
      });

      this.hide();
   }
}

export default new PortalWorkTaskUserForm();
