import TLReportsEmailCore from "../../../core/process/tasks/ABProcessTaskServiceTLReportsEmailCore.js";

// The task runs on the server (process_manager). The web platform only needs
// the class so processes that use it can be loaded and edited in ABDesigner.
export default class TLReportsEmail extends TLReportsEmailCore {}
