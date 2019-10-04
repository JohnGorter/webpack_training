# Development

---
### Development

setting up a development environment
- setting mode to 'development'

webpack.config.js
```
  const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
    plugins: [... ]
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

---
### Development (2)

The following string values are supported

|Option|Description|
|---|---|
|development|Sets process.env.NODE_ENV on DefinePlugin to value development . Enables NamedChunksPlugin and NamedModulesPlugin .
|production|Sets process.env.NODE_ENV on DefinePlugin to value production . Enables FlagDependencyUsagePlugin , FlagIncludedChunksPlugin , ModuleConcatenationPlugin , NoEmitOnErrorsPlugin , OccurrenceOrderPlugin , SideEffectsFlagPlugin and TerserPlugin .
|none|Opts out of any default optimization options

---
### Using source maps
When webpack bundles your source code
- it can become difficult to track down errors and warnings to their original location 

JavaScript offers source maps, which map your compiled code back to your original source code

As example let's use the inline-source-map option

webpack.config.js
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
    print: './src/print.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```
---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Demo time!
Source maps

---
### Auto refresh

It quickly becomes a hassle to manually run npm run build every time you want to compile your code

Options available that help automatically compile code whenever it changes:
- webpack's Watch Mode
- webpack-dev-server
- webpack-dev-middleware


In most cases, you probably would want to use webpack-dev-server

---
### Watch Mode

package.json
```
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^2.0.0",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^4.30.0",
      "xml-loader": "^1.2.1"
    }
  }
```

Now run npm run watch from the command line 

Downside: a refresh in the browser is required in order to see the changes.

---
### Webpack-dev-server

Automatically refreshes the browser

First install
```
npm install --save-dev webpack-dev-server
```
Then configure
```
webpack.config.js

  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
   ...
   devServer: {
     contentBase: './dist',
   },
   ...
  };
 ```
This tells webpack-dev-server to serve the files from the dist directory on localhost:8080

---
### Create a start script
package.json
```
  {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "private": true,
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
      "start": "webpack-dev-server --open",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^2.0.0",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "express": "^4.15.3",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^4.30.0",
      "webpack-dev-server": "^3.8.0",
      "xml-loader": "^1.2.1"
    }
  }
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Webpack dev server

---
### Webpack-dev-middleware
A wrapper that will emit files processed by webpack to a server 

- used in webpack-dev-server internally
- available as a separate package to allow more custom setups if desired
- for example express

---
### Webpack-dev-middleware (2)

First install express
```
npm install --save-dev express webpack-dev-middleware
```
The setup in webpack.config.js
```
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
    ...
    plugins: [...],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',  <--
    },
  };
```

The publicPath is used within our server script and to make sure files are served correctly on http://localhost:3000.

---
### Webpack-dev-middleware (3)
Setting up our custom express server

project
```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- server.js  <--
  |- /dist
  |- /src
    |- index.js
    |- print.js
  |- /node_modules
```
server.js
```
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```
---
### Webpack-dev-middleware (4)
Add an npm script to make it a little easier to run the server:

package.json
```
  {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "private": true,
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
      "start": "webpack-dev-server --open",
      "server": "node server.js",  // <-- 
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^2.0.0",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "express": "^4.15.3",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^4.30.0",
      "webpack-dev-middleware": "^1.12.0",
      "webpack-dev-server": "^3.8.0",
      "xml-loader": "^1.2.1"
    }
  }
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Demo time!
Webpack-dev-middleware


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Development




