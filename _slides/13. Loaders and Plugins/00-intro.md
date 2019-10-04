# Loaders and Plugins

---
### Loaders
webpack enables use of loaders to preprocess files
- allows you to bundle any static resource way beyond JavaScript

Loaders are activated by 
- activated by using loadername! prefixes in require() statements
- automatically applied via regex from your webpack configuration 


A couple of examples follow..

---
### Files
raw-loader Loads raw content of a file (utf-8)
- imports files as a String.

---
### Getting Started
To begin, you'll need to install raw-loader:
```
$ npm install raw-loader --save-dev
```

Then add the loader to your webpack config. For example:

file.js
```
import txt from './file.txt'; // or import txt from 'raw-loader!./file.txt';
```

webpack.config.js
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    ],
  },
};
```

Or from the command-line:
```
$ webpack --module-bind 'txt=raw-loader'
```

run webpack..

---
### Loaders and Frameworks

ReactJS https://medium.com/@joycelin.codes/quickstart-for-react-and-webpack-in-8-minutes-or-less-eb736da7480b
Angular: https://www.freecodecamp.org/news/how-to-configure-webpack-4-with-angular-7-a-complete-guide-9a23c879f471/
VueJS: https://cli.vuejs.org/guide/webpack.html
Svelte: https://github.com/huckbit/webpack-svelte




---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Using some loaders


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using Webpack for your framework


---
### Plugins
Plugins are the backbone of webpack. webpack itself is built on the same plugin system that you use in your webpack configuration!

They also serve the purpose of doing anything else that a loader cannot do.

---
### Anatomy
A webpack plugin is a JavaScript object that has an apply method. This apply method is called by the webpack compiler, giving access to the entire compilation lifecycle.

ConsoleLogOnBuildWebpackPlugin.js
```
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('The webpack build process is starting!!!');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

The first parameter of the tap method of the compiler hook should be a camelized version of the plugin name

---
### Usage
Since plugins can take arguments/options, you must pass a new instance to the plugins property in your webpack configuration.

Depending on how you are using webpack, there are multiple ways to use plugins.
- Configuration
webpack.config.js
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```
- Node API
some-node-script.js
```
const webpack = require('webpack'); //to access webpack runtime
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);

new webpack.ProgressPlugin().apply(compiler);

compiler.run(function(err, stats) {
  // ...
});
```

---
### Some usefull plugins
