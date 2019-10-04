const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
       title: 'Caching',
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    // optimization: {
    //    runtimeChunk: 'single',  <-- enable this to extract the runtime code into its own bundle
    // },
  };

