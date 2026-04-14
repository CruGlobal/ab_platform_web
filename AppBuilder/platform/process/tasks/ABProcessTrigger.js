// import ABApplication from "./ABApplication"
// const ABApplication = require("./ABApplication"); // NOTE: change to require()
import ABProcessTriggerCore from "../../../core/process/tasks/ABProcessTriggerCore.js";

let L = (...params) => AB.Multilingual.label(...params);

export default class ABProcessTrigger extends ABProcessTriggerCore {};
