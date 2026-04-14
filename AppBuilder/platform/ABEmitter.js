/**
 * ABEmitter
 *
 * This is the platform dependent implementation of an Emitter object.
 *
 */

import {EventEmitter} from "events";

export default class ABEmitter extends EventEmitter {
   constructor() {
      super(/*{ maxListeners: 0 }*/);
   }
};
