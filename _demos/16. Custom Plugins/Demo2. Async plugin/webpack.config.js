const path = require('path');
const FileListPlugin = require('./src/FileListPlugin')

module.exports = {
  mode: 'development',
    entry: {
      index: './src/index.js',
    },
    plugins:[
      new FileListPlugin(),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
};