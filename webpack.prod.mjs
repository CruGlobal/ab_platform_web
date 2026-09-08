import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { merge } from "webpack-merge";
import CompressionPlugin from "compression-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

/** Critters ships ESM that pulls minimatch default; load via CJS for Node interop. */
const require = createRequire(import.meta.url);
const Critters = require("critters-webpack-plugin");
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";
import webpack from "webpack";
import common from "./webpack.common.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP = path.resolve(__dirname);

export default merge(common, {
   mode: "production",
   module: {
      rules: [
         {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader?url=false"],
         },
      ],
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: "./webpack/index.ejs",
         filename: path.join(APP, "..", "web", "assets", "index.html"),
         inject: "body",
         minify: {
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: false,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
         },
      }),
      new CompressionPlugin({
         exclude: /index\.ejs/,
      }),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
         WEBPACK_MODE: JSON.stringify("production"),
         VERSION: JSON.stringify(process.env.npm_package_version),
         SENTRY_DSN: JSON.stringify(
            "https://c16443e39a66eae141954dfd23890812@o144358.ingest.sentry.io/4505832903147520"
         ),
      }),
      new Critters({
         pruneSource: false,
         preload: "swap",
      }),
      sentryWebpackPlugin({
         authToken: process.env.SENTRY_AUTH_TOKEN,
         org: "appdev-designs",
         project: "appbuilder-web",
      }),
   ],
   devtool: "source-map",
   optimization: {
      usedExports: true,
      minimizer: [
         `...`, // <- this tells webpack to use existing minifiers
         new CssMinimizerPlugin(),
      ],
   },
   resolve: {
      fallback: {
         path: false,
         fs: false,
      },
   },
});
