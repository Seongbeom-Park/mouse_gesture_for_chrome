const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      })
    ]
  },
  resolve: {
    alias: {
        "@common": path.resolve(__dirname, 'src/common'),
        "@content_scripts": path.resolve(__dirname, 'src/content_scripts'),
        "@options": path.resolve(__dirname, 'src/options'),
        "@component": path.resolve(__dirname, 'src/component'),
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
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'options.css'
            },
          },
          { loader: 'extract-loader' },
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer()
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              webpackImporter: true,
              sassOptions: {
                includePaths: ['./node_modules']
              }
            }
          }
        ]
      }
    ]
  }
};
