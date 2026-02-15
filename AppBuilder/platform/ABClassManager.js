import ABUIPlugin from "./plugins/ABUIPlugin.js";
import ABPropertiesObjectPlugin from "./plugins/ABPropertiesObjectPlugin";
import ABObjectPlugin from "./plugins/ABObjectPlugin.js";
import ABModelPlugin from "./plugins/ABModelPlugin.js";
import ABViewPlugin from "./plugins/ABViewPlugin.js";
import ABViewWidgetPlugin from "./plugins/ABViewWidgetPlugin.js";
import ABViewComponentPlugin from "./plugins/ABViewComponentPlugin.js";
import ABViewPropertiesPlugin from "./plugins/ABViewPropertiesPlugin.js";
import ABViewEditorPlugin from "./plugins/ABViewEditorPlugin.js";

// some views need to reference ABViewContainer,
import ABViewContainer from "./views/ABViewContainer.js";

// MIGRATION: ABViewManager is depreciated.  Use ABClassManager instead.
import ABViewManager from "./ABViewManager.js";

const classRegistry = {
   ObjectTypes: new Map(),
   ObjectPropertiesTypes: new Map(),
   FieldTypes: new Map(),
   ViewTypes: new Map(),
   ViewPropertiesTypes: new Map(),
   ViewEditorTypes: new Map(),
};

function registerViewPropertiesTypes(name, ctor) {
   classRegistry.ViewPropertiesTypes.set(name, ctor);
}

function registerViewEditorTypes(name, ctor) {
   classRegistry.ViewEditorTypes.set(name, ctor);
}

function registerObjectPropertiesTypes(name, ctor) {
   classRegistry.ObjectPropertiesTypes.set(name, ctor);
}

function registerObjectTypes(name, ctor) {
   classRegistry.ObjectTypes.set(name, ctor);
}

function registerViewTypes(name, ctor) {
   classRegistry.ViewTypes.set(name, ctor);
}

/**
 * @method getPluginAPI()
 * This is the data structure we provide to each of our plugins so they
 * can register their custom classes.
 * We provide base objects from which they can extend.
 * @returns {Object}
 */
export function getPluginAPI() {
   return {
      ABUIPlugin,
      ABPropertiesObjectPlugin,
      ABObjectPlugin,
      ABModelPlugin,
      ABViewPlugin,
      ABViewWidgetPlugin,
      ABViewComponentPlugin,
      ABViewPropertiesPlugin,
      ABViewEditorPlugin,
      ABViewContainer,
      //  ABFieldPlugin,
      //  ABViewPlugin,
   };
}

// export function createField(type, config) {
//   const FieldClass = classRegistry.FieldTypes.get(type);
//   if (!FieldClass) throw new Error(`Unknown object type: ${type}`);
//   return new FieldClass(config);
// }
export function createObject(key, config, AB) {
   const ObjectClass = classRegistry.ObjectTypes.get(key);
   if (!ObjectClass) throw new Error(`Unknown object type: ${key}`);
   return new ObjectClass(config, AB);
}

export function createPropertiesObject(key, config, AB) {
   const ObjectClass = classRegistry.ObjectPropertiesTypes.get(key);
   if (!ObjectClass) throw new Error(`Unknown object type: ${key}`);
   return new ObjectClass(config, AB);
}

export function allObjectProperties() {
   return Array.from(classRegistry.ObjectPropertiesTypes.values());
}

// export function createObjectProperty(key, config) {
//    const ObjectClass = classRegistry.ObjectPropertiesTypes.get(key);
//    if (!ObjectClass) throw new Error(`Unknown object type: ${key}`);
//    return new ObjectClass(config);
//  }

export function viewClass(type) {
   var ViewClass = classRegistry.ViewTypes.get(type);
   if (!ViewClass) {
      ViewClass = ABViewManager.viewClass(type, false);
      if (!ViewClass) {
         throw new Error(`Unknown View type: ${type}`);
      }
   }
   return ViewClass;
}

export function viewCreate(type, config, application, parent) {
   const ViewClass = classRegistry.ViewTypes.get(type);
   if (!ViewClass) throw new Error(`Unknown View type: ${type}`);
   return new ViewClass(config, application, parent);
}

export function viewAll(fn = () => true) {
   return Array.from(classRegistry.ViewTypes.values()).filter(fn);
}

export function viewPropertiesAll(fn = () => true) {
   return Array.from(classRegistry.ViewPropertiesTypes.values()).filter(fn);
}

export function viewEditorCreate(key, view, base, ids) {
   const EditorClass = classRegistry.ViewEditorTypes.get(key);
   if (!EditorClass) throw new Error(`Unknown View Editor type: ${key}`);
   return new EditorClass(view, base, ids);
}

export function viewEditorAll(fn = () => true) {
   return Array.from(classRegistry.ViewEditorTypes.values()).filter(fn);
}

export function pluginRegister(pluginClass) {
   let type = pluginClass.getPluginType();
   switch (type) {
      case "object":
         registerObjectTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      case "properties-object":
         registerObjectPropertiesTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      // case "field":
      //    break;
      case "view":
         registerViewTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      case "properties-view":
         registerViewPropertiesTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      case "editor-view":
         registerViewEditorTypes(pluginClass.getPluginKey(), pluginClass);
         break;
      default:
         throw new Error(
            `ABClassManager.pluginRegister():: Unknown plugin type: ${type}`
         );
   }
}

///
/// For development
///
// import propertyNSAPI from "../../../plugins/ab_plugin_object_netsuite_api/properties/ABPropertiesObjectNetsuiteAPI.js";
// import objectNSAPI from "./plugins/developer/ABObjectNetsuiteAPI.js";

export function registerLocalPlugins(API) {
   // let { registerObjectTypes, registerObjectPropertiesTypes } = API;
   // let cPropertyNSAPI = propertyNSAPI(API);
   // registerObjectPropertiesTypes(cPropertyNSAPI.getPluginKey(), cPropertyNSAPI);
   // let cObjectNSAPI = objectNSAPI(API);
   // registerObjectTypes(cObjectNSAPI.getPluginKey(), cObjectNSAPI);
}

// module.exports = {
//    getPluginAPI,
//    createPropertiesObject,
//    // createField,
//    // createObjectProperty,
//    // createView,
//    // classRegistry, // Expose the registry for testing or introspection
//    registerLocalPlugins,
// };
