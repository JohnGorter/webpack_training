# Code Splitting

---
### Code splitting 
One of the most compelling features of webpack
- allows you to split your code into various bundles
- can then be loaded on demand or in parallel
- used to achieve smaller bundles and control resource load prioritization 
- thus, can have a major impact on load time.

There are three general approaches to code splitting available:
- Entry Points: Manually split code using entry configuration
- Prevent Duplication: Use the SplitChunksPlugin to dedupe and split chunks
- Dynamic Imports: Split code via inline function calls within modules

---
### Entry Points
This is by far the easiest and most intuitive way to split code 
- more manual and has some pitfalls

Example

project
```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
  |- another-module.js  <--
|- /node_modules
```
another-module.js
```
import _ from 'lodash';

console.log(
  _.join(['Another', 'module', 'loaded!'], ' ')
);
```

---
### Entry Points (2)

webpack.config.js
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js', // <--
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

---
### Entry Points (3)

This will yield the following build result:
```
...
            Asset     Size   Chunks             Chunk Names
another.bundle.js  550 KiB  another  [emitted]  another
  index.bundle.js  550 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
...
```

---
### Entry Points (4)
pitfalls

- duplicated modules between entry chunks they will be included in both bundles
- it isn't as flexible 
- can't be used to dynamically split code with the core application logic

In the example, lodash is also imported within ./src/index.js and will thus be duplicated in both bundles

---
### SplitChunksPlugin 

This plugin allows us to extract common dependencies into an existing entry chunk or an entirely new chunk.

example to dedupe lodash dependency:

webpack.config.js
```
  const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {     // <-- new
      splitChunks: {    // <-- new
        chunks: 'all',  // <-- new
      },                // <-- new
    },                  // <-- new
  };
```

Lodash is a separate chunk and deduped


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Splitchunks demo

---
### Other splitting plugins
Here are some other useful plugins and loaders provided by the community for splitting code:

- mini-css-extract-plugin 
  - useful for splitting CSS out from the main application.
- bundle-loader
  - used to split code and lazy load the resulting bundles.
- promise-loader
  - similar to the bundle-loader but uses promises.


---
### Dynamic Imports
Two similar techniques are supported by webpack when it comes to dynamic code splitting
- use the import() (conforms to the ECMAScript proposal for dynamic imports)
- use require.ensure()

---
### Dynamic Imports (2)
import() calls use promises internally

If you use import() with older browsers, shim Promise using a polyfill
- es6-promise 
- promise-polyfill

---
### Dynamic Imports (3)
With the configuration below  

webpack.config.js
```
  const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

Note the use of chunkFilename, which determines the name of non-entry chunk files

---
### Dynamic Imports (3)

Dynamic import to separate a chunk:

src/index.js
```
 function getComponent() {
   return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
     const element = document.createElement('div');
     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
     return element;

   }).catch(error => 'An error occurred while loading the component');
  }
 getComponent().then(component => { document.body.appendChild(component); })
```

---
### Dynamic Imports (4)

As import() returns a promise, it can be used with async functions

src/index.js
```

 async function getComponent() {
   const element = document.createElement('div');
   const { default: _ } = await import(/* webpackChunkName: "lodash" */ 'lodash');
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   return element;
 }

 getComponent().then(component => {
   document.body.appendChild(component);
 });
```

However, this requires using a pre-processor like Babel and the Syntax Dynamic Import Babel Plugin

---
### Prefetching/Preloading modules

Using inline directives while declaring your imports allows webpack to output “Resource Hint” which tells the browser that for
- prefetch: resource is probably needed for some navigation in the future
- preload: resource might be needed during the current navigation

---
### Prefetching/Preloading modules (2)

Simple example:
a HomePage component, which renders a LoginButton component which then on demand loads a LoginModal component after being clicked.

LoginButton.js
```
//...
import(/* webpackPrefetch: true */ 'LoginModal');
```

This will result in 'link rel="prefetch" href="login-modal-chunk.js"' being appended in the head of the page
- will instruct the browser to prefetch in idle time the login-modal-chunk.js file

---
### Preload vs prefetch

|| Preload Chunk | Prefetch Chunk |
|---|---|---|
|loads| parallel | synchronous|
| priority|medium, instant download| downloaded when browser is idle|
|requested| instant from parent chunk| on demand|


*Browser support is different


---
### Preload Example
Imagine a component which needs huge ChartingLibrary. It displays a LoadingIndicator when rendered and instantly does an on demand import of ChartingLibrary

ChartComponent.js

```
//...
import(/* webpackPreload: true */ 'ChartingLibrary');
```

When a page which uses the ChartComponent is requested, the charting-library-chunk is also requested via 'link rel="preload"'. 

Assuming the page-chunk is smaller and finishes faster, the page will be displayed with a LoadingIndicator, until the already requested charting-library-chunk finishes.


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Prefetch Example


---
### Bundle Analysis

It can be useful to analyze the output to check where modules have ended up
- official analyze tool
http://webpack.github.io/analyse/

Some other community-supported options 
- webpack-chart: Interactive pie chart for webpack stats.
- webpack-visualizer: Visualize and analyze your bundles to see which modules are taking up space and which might be duplicates.
- webpack-bundle-analyzer: A plugin and CLI utility that represents bundle content as a convenient interactive zoomable treemap.
- webpack bundle optimize helper: This tool will analyze your bundle and give you actionable suggestions on what to improve to reduce your bundle size.
- bundle-stats: Generate a bundle report(bundle size, assets, modules) and compare the results between different builds.

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Bundle Analyser

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Code Splitting




