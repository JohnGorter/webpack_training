# Targets

---
### Targets

Because JavaScript can be written for both server and browser, webpack offers multiple deployment targets that you can set in your webpack configuration

Usage
To set the target property, you simply set the target value in your webpack config:
```
webpack.config.js

module.exports = {
  target: 'node'    // <-- web is the default
};
```

In the example above, using node webpack will compile for usage in a Node.js-like environment

---
### Multiple Targets
Although webpack does not support multiple strings being passed into the target property, you can create an isomorphic library by bundling two separate configurations:

webpack.config.js
```
const path = require('path');
const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

const clientConfig = {
  target: 'web', // <=== can be omitted as default is 'web'
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```

The example above will create a lib.js and lib.node.js file in your dist folder.

---
### Resources
As seen from the options above, there are multiple deployment targets that you can choose from. Below is a list of examples and resources that you can refer to.

- compare-webpack-target-bundles: A great resource for testing and viewing different webpack targets
- Boilerplate of Electron-React Application: A good example of a build process for electron's main process and renderer proces


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Server side webpack

https://www.codementor.io/lawwantsin/compiling-our-express-server-with-webpack-lds4xof0y
