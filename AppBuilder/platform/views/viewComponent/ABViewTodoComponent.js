const ABViewComponent = require("./ABViewComponent").default;

module.exports = class ABViewTodoComponent extends ABViewComponent {
   constructor(baseView, idBase, ids) {
      super(
         baseView,
         idBase || `ABViewTodo_${baseView.id}`,
         Object.assign({ todo: "" }, ids)
      );
   }

   ui() {
	// This will be your webix ui.
      const _uiTodo = {};

      const _ui = super.ui([_uiTodo]);

      delete _ui.type;

      return _ui;
   }

   async init(AB) {
      await super.init(AB);
	// Code to initialize our view
   }
}

