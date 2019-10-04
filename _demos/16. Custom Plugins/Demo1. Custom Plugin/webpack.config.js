const path = require('path');
const LogPlugin = require('./src/LogPLugin')

module.exports = {
  mode: 'development',
    entry: {
      index: './src/index.js',
    },
    plugins:[
      new LogPlugin(),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
};