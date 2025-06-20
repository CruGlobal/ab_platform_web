const ABViewTodoCore = require("../../core/views/ABViewTodoCore");
const ABViewTodoComponent = require("./viewComponent/ABViewTodoComponent");

module.exports = class ABViewTodo extends ABViewTodoCore {
   /**
    * @method component()
    * return a UI component based upon this view.
    * @return {obj} UI component
    */
   component() {
      return new ABViewTodoComponent(this);
   }
};

