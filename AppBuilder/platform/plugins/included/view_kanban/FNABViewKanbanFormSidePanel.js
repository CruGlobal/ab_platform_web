/*
 * FNABViewKanbanFormSidePanel
 *
 * Form area for editing Kanban cards (included plugin; ESM).
 */

export default function FNABViewKanbanFormSidePanel({
   ABViewComponentPlugin,
   ABViewKanbanDetachedFormSave,
}) {
   return class FNABViewKanbanFormSidePanel extends ABViewComponentPlugin {
      constructor(comKanBan, idBase, editFields) {
         super(comKanBan, idBase || `${comKanBan.view?.id}_formSidePanel`, {
            form: "",
         });

         this.editFields = editFields;

         this._mockApp = this.AB.applicationNew({});
      }

      ui() {
         const ids = this.ids;
         const L = (...params) => this.AB.Multilingual.label(...params);

         return {
            id: ids.component,
            width: 300,
            hidden: true,
            rows: [
               {
                  view: "toolbar",
                  css: "webix_dark",
                  cols: [
                     {
                        view: "label",
                        label: L("Edit Record"),
                     },
                     {
                        view: "icon",
                        icon: "wxi-close",
                        align: "right",
                        click: () => {
                           this.hide();
                        },
                     },
                  ],
               },
               {
                  view: "scrollview",
                  body: {
                     rows: [
                        {
                           id: ids.form,
                           view: "form",
                           type: "clean",
                           borderless: true,
                           rows: [],
                        },
                     ],
                  },
               },
            ],
         };
      }

      hide() {
         $$(this.ids.component)?.hide();

         this.emit("close");
      }

      show(data) {
         $$(this.ids.component)?.show();

         this.refreshForm(data);
      }

      isVisible() {
         return $$(this.ids.component)?.isVisible() ?? false;
      }

      refreshForm(data) {
         const ids = this.ids;
         const $formView = $$(ids.form);
         const CurrentObject = this.CurrentObject;

         if (!CurrentObject || !$formView) return;

         data = data || {};

         const formAttrs = {
            id: `${this.ids.component}_sideform`,
            key: "form",
            settings: {
               columns: 1,
               labelPosition: "top",
               showLabel: 1,
               clearOnLoad: 0,
               clearOnSave: 0,
               labelWidth: 120,
               height: 0,
            },
         };

         const form = this.AB.viewNewDetatched(formAttrs);

         form.objectLoad(CurrentObject);

         CurrentObject.fields().forEach((f, index) => {
            if (!this.editFields || this.editFields.indexOf(f.id) > -1) {
               form.addFieldToForm(f, index);
            }
         });

         form._views.push(
            new ABViewKanbanDetachedFormSave(
               {
                  settings: {
                     includeSave: true,
                     includeCancel: false,
                     includeReset: false,
                  },
                  position: {
                     y: CurrentObject.fields().length,
                  },
               },
               this._mockApp,
               form
            )
         );

         form._views.forEach(
            (v, index) => (v.id = `${form.id}_${v.key}_${index}`)
         );

         const formCom = form.component(this.AB._App);

         webix.ui(formCom.ui().rows.concat({}), $formView);
         webix.extend($formView, webix.ProgressBar);

         formCom.init(
            this.AB,
            2,
            {
               onBeforeSaveData: () => {
                  const formVals = form.getFormValues($formView, CurrentObject);

                  if (!form.validateData($formView, CurrentObject, formVals))
                     return false;

                  $formView?.showProgress({ type: "icon" });

                  if (formVals.id) {
                     CurrentObject.model()
                        .update(formVals.id, formVals)
                        .then((updateVals) => {
                           this.emit("update", updateVals);

                           $formView?.hideProgress({ type: "icon" });
                        })
                        .catch((err) => {
                           this.AB.notify.developer(err, {
                              context:
                                 "ABViewKanbanFormSidePanel:onBeforeSaveData():update(): Error updating value",
                              formVals,
                           });
                           $formView?.hideProgress({ type: "icon" });
                        });
                  } else {
                     CurrentObject.model()
                        .create(formVals)
                        .then((newVals) => {
                           this.emit("add", newVals);

                           $formView?.hideProgress({ type: "icon" });
                        })
                        .catch((err) => {
                           this.AB.notify.developer(err, {
                              context:
                                 "ABViewKanbanFormSidePanel:onBeforeSaveData():.create(): Error creating value",
                              formVals,
                           });

                           $formView?.hideProgress({ type: "icon" });
                        });
                  }

                  return false;
               },
            },
            2
         );

         $formView.clear();
         $formView.parse(data);

         formCom.onShow(data);
      }
   };
}
