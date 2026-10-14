const FNABViewPropertyLinkPage =
   require("../../plugins/included/view_core/FNABViewPropertyLinkPage.js").default;
const ABUIPlugin = require("../../plugins/ABUIPlugin.js").default;
const ABViewPlugin = require("../../plugins/ABViewPlugin.js").default;
const ABViewComponentPlugin =
   require("../../plugins/ABViewComponentPlugin.js").default;

module.exports = FNABViewPropertyLinkPage({
   ABUIPlugin,
   ABViewPlugin,
   ABViewComponentPlugin,
});
