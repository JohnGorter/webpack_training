# Authoring Libraries

---
### Authoring Libraries (1)

A JavaScript library (isomorphic) has the following requirements:
- It should support 
```  
import * as webpackNumbers from 'webpack-numbers'; // ES2015 module import
const webpackNumbers = require('webpack-numbers'); // CommonJS module require 
require(['webpackNumbers'], function (webpackNumbers) {.. //  AMD module require
```
- and HTML
```
<!doctype html>
<html>
  ...
  <script src="https://unpkg.com/webpack-numbers"></script>
  <script>
    // ...
    // Global variable
    webpackNumbers.wordToNum('Five')
    // Property in the window object
    window.webpackNumbers.wordToNum('Five')
    // ...
  </script>
</html>
```

We also want to configure it to expose the library in the following ways
- property in the global object, for node
- property in the this object

---
### Example Library

Suppose we want to make the following library

src/index.js
```
import _ from 'lodash';
import numRef from './ref.json';

export function numToWord(num) {
  return _.reduce(numRef, (accum, ref) => {
    return ref.num === num ? ref.word : accum;
  }, '');
}

export function wordToNum(word) {
  return _.reduce(numRef, (accum, ref) => {
    return ref.word === word && word.toLowerCase() ? ref.num : accum;
  }, -1);
}
```

src/ref.json
```
[ {"num": 1, "word": "One" },
  {"num": 2, "word": "Two" },
  {"num": 3, "word": "Three" },  
  {"num": 4, "word": "Four" },
  {"num": 5, "word": "Five" },
  {"num": 0, "word": "Zero" } ]
```

---
### Authoring Libraries (2)

A recap of the requirements
- using externals to avoid bundling lodash
  - so the consumer is required to load it
- setting the library name, for example 'webpack-numbers'
- exposing the library as a variable (called 'webpackNumbers')
- (again) access the library inside Node.js
- (again) access the library in the following ways
  - ES2015 module. i.e. import webpackNumbers from 'webpack-numbers'.
  - CommonJS module. i.e. require('webpack-numbers').
  - Global variable when included through script tag.

---
### Authoring Libraries (2)

How would we configure webpack to create all of this?

webpack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',  // <-- requirement set
  },
};
```

---
### Externalize Lodash
Webpack creates a largish bundle because of lodash 

We'd prefer to treat lodash as a peerDependency
- the consumer should already have lodash installed

This can be done using the externals configuration

webpack.config.js
```
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
    },
   externals: {  // <--
     lodash: {
       commonjs: 'lodash',
       commonjs2: 'lodash',
       amd: 'lodash',
       root: '_',
     },
   },
  };
```

This means that your library expects a dependency named lodash to be available in the consumer's environment

---
### External Limitations
For libraries that use several files from a dependency:
```
import A from 'library/one';
import B from 'library/two';
```

excluding them from the bundle by specifying library in the externals wont work

You'll either need to exclude them one by one or by using a regular expression:
```
module.exports = {
  //...
  externals: [
    'library/one',
    'library/two',
    // Everything that starts with "library/"
    /^library\/.+$/,
  ],
};
```

---
### Expose the Library

For widespread use of the library
- compatibillity in different environments, i.e. CommonJS, AMD, Node.js and as a global variable, is required


webpack.config.js
```
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
      library: 'webpackNumbers',   // <--
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_',
      },
    },
  };
```

This exposes your library bundle available as a global variable named webpackNumbers when imported

---
### Other environments 
To make the library compatible with other environments, add libraryTarget property to the config

webpack.config.js
```
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
      library: 'webpackNumbers',
      libraryTarget: 'umd',    // <-- 
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_',
      },
    },
  };
```

---
### Other environments (2)
You can expose the library in the following ways
- Variable: as a global variable made available by a script tag (libraryTarget:'var').
- This: available through the this object (libraryTarget:'this').
- Window: available through the window object, in the browser (libraryTarget:'window').
- UMD: available after AMD or CommonJS require (libraryTarget:'umd').

If you want all flavors, you have to call webpack multiple times. More on this later.

---
### Final Steps
To ship the library, add the path to your generated bundle as the package's main field in with the package.json

package.json
```
{
  ...
  "main": "dist/webpack-numbers.js",
  ...
}
```
Or, to add it as a standard module as per this guide:
```
{
  ...
  "module": "src/index.js",
  ...
}
```

The key main refers to the standard from package.json

The key module to a proposal to allow the JavaScript ecosystem upgrade to use ES2015 modules without breaking backwards compatibility

Now you can publish it as an npm package and find it at unpkg.com!


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Building a library


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Caching




