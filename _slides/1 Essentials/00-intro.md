# Essentials

---
### Concepts

> At its core, webpack is a static module bundler for modern JavaScript applications 

When webpack processes your application, it 
- builds a dependency graph which maps every module your project needs 
- generates one or more bundles.


Since version 4.0.0, webpack does not require a configuration file 
- Nevertheless, it is incredibly configurable to better fit your needs

---
### Concepts (2)

To get started you only need to understand its Core Concepts
- Entry
- Output
- Loaders
- Plugins
- Mode
- Browser Compatibility


---
### Entry
An entry point indicates which module webpack should use to begin building out its internal dependency graph
- webpack will figure out which other modules this entry point depends on 

By default its value is ./src/index.js, but you can specify a different 

For example:

webpack.config.js
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

---
### Output
The output property tells webpack where to emit the bundles it creates and how to name these files. 

It defaults to 
- ./dist/main.js for the main output file 
- ./dist folder for any other generated file

You can configure this part of the process by specifying an output field in your configuration:

webpack.config.js
```
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

---
### Loaders
Out of the box, webpack only understands JavaScript and JSON files. 

Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph

At a high level, loaders have two properties in your webpack configuration:
- the test property identifies which file or files should be transformed.
- the use property indicates which loader should be used to do the transforming

webpack.config.js
```
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```


---
### Plugins
While loaders are used to transform certain types of modules, 
plugins can be leveraged to perform a wider range of tasks like 
- bundle optimization
- asset management and 
- injection of environment variables

In order to use a plugin, you need to require() it and add it to the plugins array

Most plugins are customizable through options

webpack.config.js
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```
There are many plugins that webpack provides out of the box! 

---
### Mode
By setting the mode parameter to either development, production or none, you can enable webpack's built-in optimizations that correspond to each environment 

The default value is production.
```
module.exports = {
  mode: 'production'
};
```


---
### Browser Compatibility
webpack supports all browsers that are ES5-compliant 
- IE8 and below are not supported

webpack needs Promise for import() and require.ensure() 
- if you want to support older browsers, you will need to load a polyfill before using these expressions

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Hello Webpack


