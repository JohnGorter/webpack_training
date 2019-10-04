# Hot Module Replacement

---
### Hot Module Replacement

HMR exchanges, adds, or removes modules
- while an application is running 
- without a full reload 

It
- retains application state which is lost during a full reload
- only updates what's changed
- instantly updates the browser when modifications are made to CSS/JS 

---
### How It Works

There are four parts
- The application
    the application needs to refresh on the front-end
- The runtime
    the runtime needs to grab and apply the updates
- The compiler
    the compiler needs to provide update chunks
- The Module
    you have to write modules that opt-in in HMR

---
### In the Application
- application asks the HMR runtime to check for updates
- runtime asynchronously downloads the updates and notifies the application
- application then asks the runtime to apply the updates
- runtime synchronously applies the updates

You can set up HMR so that this process happens automatically, or you can choose to require user interaction for updates to occur

---
### In the Compiler
In addition to normal assets, the compiler needs to emit an "update" to allow updating from the previous version to the new version. 

The "update" consists of two parts
- the updated manifest (JSON)
- One or more updated chunks (JavaScript)

The manifest contains the new compilation hash and a list of all updated chunks
Each of these chunks contains the new code for all updated modules (or a flag indicating that the module was removed)


---
### In a Module
HMR is an opt-in feature that only affects modules containing HMR code.

The HMR interface is called when it receives an update through HMR, it replaces the old styles with the new ones

When implementing the HMR interface in a module, you can describe what should happen when the module is updated.


---
### In the Runtime

For the module system runtime, additional code is emitted to track module parents and children. 

On the management side, the runtime supports two methods: check and apply

---
### Check
A check makes an HTTP request to the update manifest
- if this request fails, there is no update available
- if it succeeds, the list of updated chunks is compared to the list of currently loaded chunks
    - for each loaded chunk, the corresponding update chunk is downloaded
    - when all update chunks are downloaded and are ready, the runtime switches into the ready state

---
### Apply
The apply method flags all updated modules as invalid
- for each invalid module, there needs to be an update handler in the module or in its parent(s)
- otherwise, the invalid flag bubbles up and invalidates parent(s) as well
- each bubble continues until the app's entry point or a module with an update handler is reached (whichever comes first)
    -if it bubbles up from an entry point, the process fails
- afterwards, all invalid modules are disposed (via the dispose handler) and unloaded. 
    - the current hash is updated and all accept handlers are called
    - the runtime switches back to the idle state and everything continues as normal

---
### Enabling HMR

Update our webpack-dev-server configuration, and use webpack's built-in HMR plugin

webpack.config.js
```
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
    entry: {
       app: './src/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true,  // <--
    },
    ...
  };
```

You can use the CLI to modify the webpack-dev-server configuration
```
webpack-dev-server --hotOnly
```

---
### Enabling HMR (2)

Update the JavaScript source so changes are detected 

index.js
```
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());

  if (module.hot) {         // <-- new code 
   module.hot.accept('./print.js', function() {
     console.log('Accepting the updated printMe module!');
     printMe();
   })
 }
```

---
### Enabling HMR (2)

Now start changing the console.log statement in print.js, and you should see the following output in the browser console 

print.js
```
  export default function printMe() {
    console.log('Updating print.js...');
  }
```
console
```
[HMR] Waiting for update signal from WDS...
main.js:4395 [WDS] Hot Module Replacement enabled.
+ 2main.js:4395 [WDS] App updated. Recompiling...
+ main.js:4395 [WDS] App hot update...
+ main.js:4330 [HMR] Checking for updates on the server...
+ main.js:10024 Accepting the updated printMe module!
+ 0.4b8ee77….hot-update.js:10 Updating print.js...
+ main.js:4330 [HMR] Updated modules:
+ main.js:4330 [HMR]  - 20
```

---
### Gotchas
Hot Module Replacement can be tricky.
- click the button on the example page
- console prints the old printMe function

This happens because the button's onclick event handler is still bound to the original printMe function

To fix it, use module.hot.accept:

index.js
```
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick event is bind to the original printMe function

    element.appendChild(btn);

    return element;
  }

  let element = component(); // Store the element to re-render on print.js changes
  document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
      document.body.removeChild(element);
      element = component(); // Re-render the "component" to update the click handler
     document.body.appendChild(element);
    })
  }
```

This is just one example, but there are many others that can easily trip people up

 Luckily, there are loaders that will make hot module replacement easier

---
### HMR with Stylesheets
Hot Module Replacement with CSS is actually fairly straightforward with the help of the style-loader

style-loader
- uses module.hot.accept behind the scenes to patch style tags when CSS dependencies are updated

First let's install both loaders with the following command:
```
npm install --save-dev style-loader css-loader
```

---
### HMR with Stylesheets (2)

Now let's update the configuration file to make use of the loader.

webpack.config.js
```
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true,
    },
    module: {    //<---
     rules: [
       {
         test: /\.css$/,
         use: ['style-loader', 'css-loader'],
       },
     ],
   },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

---
### HMR with Stylesheets (3)
Hot loading stylesheets is as easy as importing them into a module:

project
```
  webpack-demo
  | - package.json
  | - webpack.config.js
  | - /dist
    | - bundle.js
  | - /src
    | - index.js
    | - print.js
   | - styles.css
```
styles.css
```
body {
  background: blue;
}
```
index.js
```
  import _ from 'lodash';
  import printMe from './print.js';
  import './styles.css';

  function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick event is bind to the original printMe function

    element.appendChild(btn);

    return element;
  }

  let element = component();
  document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
      document.body.removeChild(element);
      element = component(); // Re-render the "component" to update the click handler
      document.body.appendChild(element);
    })
  }
```

---
### HMR with Stylesheets (4)
Change the style on body to background: red; and you should immediately see the page's background color change without a full refresh

```
styles.css

  body {
   background: red;
  }
```


---
### Other Code and Frameworks
There are many other loaders and examples out in the community to make HMR interact smoothly with a variety of frameworks and libraries...

- React Hot Loader: Tweak react components in real time.
- Vue Loader: This loader supports HMR for vue components out of the box.
- Elm Hot webpack Loader: Supports HMR for the Elm programming language.
- Angular HMR: No loader necessary! A simple change to your main NgModule file is all that's required to have full control over the HMR APIs.
- Svelte Loader: This loader supports HMR for Svelte components out of the box.

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Hot Module Reloading


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Hot Module Reloading
