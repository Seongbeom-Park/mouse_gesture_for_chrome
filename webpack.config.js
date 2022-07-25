const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  resolve: {
    alias: {
        "@common": path.resolve(__dirname, 'src/common'),
        "@content_scripts": path.resolve(__dirname, 'src/content_scripts'),
        "@options": path.resolve(__dirname, 'src/options'),
    }
  },
  entry: {
    background: "./src/background/background.js",
    content_scripts: "./src/content_scripts/gesture.js",
    options: "./src/options/options.js",
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json' },
        { from: 'resource' },
        { from: 'src/options/options.css' },
      ]
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'src/options/options.html',
      inject: false
    }),
  ],
  experiments: {
    topLevelAwait: true
  }
};