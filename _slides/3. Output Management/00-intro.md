# Output Management

---
### Why output management

Manually including all assets in index.html will become difficult to handle when your project grows

However, a few plugins exist that will make this process much easier to manage

---
### Scenario
Suppose we had this project structure

project
```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
    |- print.js  <-- notice the second entry
  |- /node_modules
```

---
### Scenario (2)

inside src/print.js
```
export default function printMe() {
  console.log('I get called from print.js!');
}
```
and in our src/index.js file
```
src/index.js

  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
   const btn = document.createElement('button');
   btn.innerHTML = 'Click me and check the console!';
   btn.onclick = printMe;
   element.appendChild(btn);
   return element;
  }

  document.body.appendChild(component());
```
---
### Scenario (3)

The dist/index.html file, in preparation for webpack to split out entries, looks like

dist/index.html
```
  <!doctype html>
  <html>
    <head>
     <title>Output Management</title>
     <script src="./print.bundle.js"></script>
    </head>
    <body>
     <script src="./app.bundle.js"></script>
    </body>
  </html>
```
finally the webpack.config looks like
```
  const path = require('path');

  module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
  };
```
---
### Scenario (4)

Run npm run build to see
```
...
          Asset     Size  Chunks                    Chunk Names
  app.bundle.js   545 kB    0, 1  [emitted]  [big]  app
print.bundle.js  2.74 kB       1  [emitted]         print
...
```

Webpack generates print.bundle.js and app.bundle.js files, also specified in our index.html file.

But what would happen if we changed the name of one of our entry points, or even added a new one? 

---
### HtmlWebpackPlugin

The HtmlWebpackPlugin by default will generate its own index.html with all the bundles loaded automatically

---
### HtmlWebpackPlugin (2)

First install the plugin and adjust the webpack.config.js file
```
npm install --save-dev html-webpack-plugin
```
webpack.config.js
```
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
    plugins: [
      new HtmlWebpackPlugin({          <----
        title: 'Output Management',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```
---
### HtmlWebpackPlugin (3)

Do an npm run build
```
...
           Asset       Size  Chunks                    Chunk Names
 print.bundle.js     544 kB       0  [emitted]  [big]  print
   app.bundle.js    2.81 kB       1  [emitted]         app
      index.html  249 bytes          [emitted]
...
```

Open the index.html and see that the HtmlWebpackPlugin has created an entirely new file for you and that all the bundles are automatically added

---
### Cleaning up the /dist folder
The /dist folder can become quite cluttered. 

Webpack will generate files and put them in the /dist folder, but it doesn't keep track of which files are actually in use by your project.

It's good practice to clean the /dist folder before each build, so that only used files will be generated. 
- clean-webpack-plugin 

---
### Cleaning up the /dist folder (2)
First to install
```
npm install --save-dev clean-webpack-plugin
```

then change webpack.config.js
```
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Output Management',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

Now run an npm run build and inspect the /dist folder. If everything went well you should now only see the files generated from the build and no more old files!


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Output Management



