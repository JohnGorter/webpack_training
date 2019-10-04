# Caching

---
### Caching

- browsers use a technique called caching
  - allows sites to load faster with less unnecessary network traffic
  
however, it can also cause headaches when you need new code to be picked up.

challenge:
- configuration needed to ensure files produced by webpack compilation can remain cached unless their content has changed

---
### Output Filenames

output.filename substitutions define the names of our output files

webpack provides a method of templating the filenames using bracketed strings called substitutions
- [contenthash] substitution will add a unique hash based on the content of an asset
  - when the asset's content changes, [contenthash] will change as well

---
### Output Filenames Example

webpack.config.js
```
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
       title: 'Caching',
    }),
  ],
  output: {
     filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

---
### Output Filenames Example (2)
Running our build script, npm run build, with this configuration should produce the following output:
```
...
                       Asset       Size  Chunks                    Chunk Names
main.7e2c49a622975ebd9b7e.js     544 kB       0  [emitted]  [big]  main
                  index.html  197 bytes          [emitted]
...
```

As you can see the bundle's name now reflects its content (via the hash)

If another build without changes is run, a new hash is calculated
Why: boilerplate code changed

---
### Extracting Boilerplate

the SplitChunksPlugin can be used to split modules out into separate bundles

webpack provides an optimization feature to split runtime code into a separate chunk using the optimization.runtimeChunk option. 

Set it to single to create a single runtime bundle for all chunks

webpack.config.js
```
  const path = require('path');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Caching',
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
   optimization: {
     runtimeChunk: 'single',  // <--
   },
  };
```

---
### Extracting Boilerplate output
The output
```
Hash: 82c9c385607b2150fab2
Version: webpack 4.12.0
Time: 3027ms
                          Asset       Size  Chunks             Chunk Names
runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
   main.e81de2cf758ada72f306.js   69.5 KiB       1  [emitted]  main
                     index.html  275 bytes          [emitted]
[1] (webpack)/buildin/module.js 497 bytes {1} [built]
[2] (webpack)/buildin/global.js 489 bytes {1} [built]
[3] ./src/index.js 309 bytes {1} [built]
    + 1 hidden module
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Cachenames

---
### CacheGroups

Good practice
- extract third-party libraries, such as lodash or react, to a separate vendor chunk as they are less likely to change than our local source code

this can be done by using the cacheGroups option of the SplitChunksPlugin

webpack.config.js

```
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Caching',
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {             // <--
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

---
### CacheGroups (2)

Run another build to see our new vendor bundle:
```
...
                          Asset       Size  Chunks             Chunk Names
runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
vendors.a42c3ca0d742766d7a28.js   69.4 KiB       1  [emitted]  vendors
   main.abf44fedb7d11d4312d7.js  240 bytes       2  [emitted]  main
                     index.html  353 bytes          [emitted]
...
```
Our main bundle does not contain vendor code from node_modules directory and is down in size to 240 bytes!

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
CacheGroups

---
### Module Identifiers
Suppose there is another module, print.js

project
```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
  |- print.js  <--
|- /node_modules
```

print.js
```
 export default function print(text) {
   console.log(text);
 };
```

src/index.js
```
  import _ from 'lodash';
  import Print from './print'; // <--
  function component() {
    const element = document.createElement('div');
    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.onclick = Print.bind(null, 'Hello webpack!');
    return element;
  }
  document.body.appendChild(component());
```
---
### Module Identifiers (2)
Running another build, you'd expect only our main bundle's hash to change, however...
```
...
                           Asset       Size  Chunks                    Chunk Names
  runtime.1400d5af64fc1b7b3a45.js    5.85 kB      0  [emitted]         runtime
  vendor.a7561fb0e9a071baadb9.js     541 kB       1  [emitted]  [big]  vendor
    main.b746e3eb72875af2caa9.js    1.22 kB       2  [emitted]         main
                      index.html  352 bytes          [emitted]
...
```
... see that all three have

This is because each module.id is incremented based on resolving order by default
- when the order of resolving is changed, the IDs will be changed as well

So:
- the main bundle changed because of its new content
- the vendor bundle changed because its module.id was changed
- the runtime bundle changed because it now contains a reference to a new module

---
### Module Identifiers (3)

The first and last are expected, it's the vendor hash we want to fix. 

You can use optimization.moduleIds with 'hashed' option:

webpack.config.js
```
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Caching',
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    moduleIds: 'hashed',  // <--
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

Now, despite any new local dependencies, our vendor hash should stay consistent between builds:

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Caching




