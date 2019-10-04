# Tree Shaking

---
### Tree Shaking

Tree shaking is dead-code elimination

 It relies on the static structure of ES2015 module syntax
 - import 
 - export
 
---
### A Showcase

Let's add a new utility file to our project, src/math.js, that exports two functions:

project
```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
  |- math.js
|- /node_modules
```
src/math.js
```
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}
```

---
### A Showcase (2)

Next, set the mode configuration option to development to make sure that the bundle is not minified

webpack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  optimization: {
    usedExports: true,
  },
};
```
---
### A Showcase (3)

With that in place, let's create an entry script to utilize these new methods 

src/index.js
```
  import { cube } from './math.js';

  function component() {
    const element = document.createElement('pre');
    element.innerHTML = [
      'Hello webpack!',
      '5 cubed is equal to ' + cube(5)
    ].join('\n\n');
    return element;
  }

  document.body.appendChild(component());
```

 the square method from the src/math.js module is not imported
 - known as "dead code"

---
### A Showcase (4)

The output after build is 

dist/bundle.js (around lines 90 - 100)
```
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
  'use strict';
  /* unused harmony export square */
  /* harmony export (immutable) */ __webpack_exports__['a'] = cube;
  function square(x) {
    return x * x;
  }

  function cube(x) {
    return x * x * x;
  }
});
```

Note that square is not being imported, however, it is still included in the bundle

---
### The Fix

Mark the file as side-effect-free

In package.json 
```
{
  "name": "your-project",
  "sideEffects": false
}
```

All the code noted above does not contain side effects, so simply mark the property as false so webpack can safely prune unused exports

A "side effect" is defined as
- code that performs a special behavior when imported, other than exposing one or more exports

example
- polyfills, which affect the global scope

---
### The Fix (2)

If your code did have some side effects though, an array can be provided instead:
```
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```
The array accepts relative, absolute, and glob patterns to the relevant files


---
### The Fix (3)
Any imported file is subject to tree shaking

If you use something like css-loader in your project and import a CSS file, it needs to be added to the side effect list so it will not be unintentionally dropped in production mode:
```
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```
"sideEffects" can also be set from the module.rules configuration option

---
### Minify the Output
So we've cued up our "dead code" to be dropped by using the import and export syntax
- we still need to drop it from the bundle
- set the mode configuration option to production

webpack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
```

With that squared away, we can run another npm run build and see if anything has changed.

---
### Summary
In order to take advantage of tree shaking, you must...

- use ES2015 module syntax (i.e. import and export)
- ensure no compilers transform your ES2015 module syntax into CommonJS modules 
- add a "sideEffects" property to your project's package.json file
- use the production mode configuration option to enable various optimizations including minification and tree shaking

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Tree Shaking


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Tree Shaking
