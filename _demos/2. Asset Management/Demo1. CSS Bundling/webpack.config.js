const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    watch:true,
    devServer: {
        contentBase: path.join(__dirname, "./dist/"),
        port: 9000
    },
   module: {
     rules: [
       {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader',
         ],
       },
     ],
   },
  };