const path = require("path");
const APP = path.resolve(__dirname);
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(common, {
   mode: "development",
   // Use 'eval-source-map' for faster builds, or 'source-map' for better quality
   // 'source-map' provides the best debugging experience for library code
   devtool: "source-map",
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader?url=false"],
         },
      ],
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: "./webpack/index.ejs",
         filename: path.join(APP, "..", "web", "assets", "index.html"),
         inject: "body",
      }),
      new webpack.DefinePlugin({
         WEBPACK_MODE: JSON.stringify("development"),
         VERSION: JSON.stringify(process.env.npm_package_version),
         SENTRY_DSN: JSON.stringify(undefined),
      }),
   ],
   resolve: {
      fallback: {
         path: false,
         fs: false,
      },
   },
});
