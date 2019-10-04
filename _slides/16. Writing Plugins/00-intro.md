# Writing Plugins

---
###  Writing Plugins

Plugins expose the full potential of the webpack engine to third-party developer

Using staged build callbacks, developers can introduce their own behaviors into the webpack build process


---
### Creating a Plugin
A plugin for webpack consists of

- a named JavaScript function or a JavaScript class
- defines apply method in its prototype
- specifies an event hook to tap into
- manipulates webpack internal instance specific data
- invokes webpack provided callback after functionality is complete

https://github.com/webpack/tapable

---
### Example 
```
// A JavaScript class.
class MyExampleWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync(
      'MyExampleWebpackPlugin',
      (compilation, callback) => {
        console.log('This is an example plugin!');
        console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

        // Manipulate the build using the plugin API provided by webpack
        // compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}
```

---
### Basic plugin architecture
Plugins are instantiated objects with an apply method on their prototype. 
- called once by the webpack compiler while installing the plugin
- given a reference to the underlying webpack compiler, which grants access to compiler callbacks

```
class HelloWorldPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Hello World Plugin', (
      stats /* stats is passed as argument when done hook is tapped.  */
    ) => {
      console.log('Hello World!');
    });
  }
}
module.exports = HelloWorldPlugin;
```
Then to use the plugin, include an instance in your webpack config plugins array:
```
// webpack.config.js
var HelloWorldPlugin = require('hello-world');
module.exports = {
  // ... config settings here ...
  plugins: [new HelloWorldPlugin({ options: true })]
};
```

---
### Compiler and Compilation
Among the two most important resources while developing plugins are 
- the compiler 
- compilation objects

```
class HelloCompilationPlugin {
  apply(compiler) {
    // Tap into compilation hook which gives compilation as argument to the callback function
    compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
      // Now we can tap into various hooks available through compilation
      compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
        console.log('Assets are being optimized.');
      });
    });
  }
}

module.exports = HelloCompilationPlugin;
```

The list of hooks available on the compiler, compilation, and other important objects, see the plugins API docs.

---
### Async Event Hooks

Some plugin hooks are asynchronous. 

To tap into them, we can use 
- tap method, behaves in synchronous manner 
- tapAsync / tapPromise method which are asynchronous methods
  - you need to call the callback function which is supplied as the last argument to our function


---
### tapAsync

example
```
class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('HelloAsyncPlugin', (compilation, callback) => {
      // Do something async...
      setTimeout(function() {
        console.log('Done with async work...');
        callback();
      }, 1000);
    });
  }
}

module.exports = HelloAsyncPlugin;
```

---
### tapPromise

example
```
class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapPromise('HelloAsyncPlugin', compilation => {
      // return a Promise that resolves when we are done...
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          console.log('Done with async work...');
          resolve();
        }, 1000);
      });
    });
  }
}

module.exports = HelloAsyncPlugin;
```

---
### Usecases
We can 
- reformat existing files
- create derivative files
- fabricate entirely new assets

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Custom Plugin

---
### Different Plugin Shapes
A plugin can be classified into types based on the event hooks it taps into

Every event hook is pre-defined as 
- synchronous or asynchronous
- waterfall or parallel hook and hook is called internally using call/callAsync method

The list of hooks that are supported or can be tapped into are generally specified in this.hooks property.

For example:
```
this.hooks = {
  shouldEmit: new SyncBailHook(['compilation'])
};
```

It represents that 
- the only hook supported is shouldEmit 
- is a hook of SyncBailHook type 
- the only parameter which will be passed to any plugin that taps into shouldEmit hook is compilation

---
### Hook types
Various types of hooks supported are
- Synchronous Hooks
  - defined as new SyncHook([params])
  - tapped into using tap method
  - called using call(...params) method

- Bail Hooks
  - defined using SyncBailHook[params]
  - tapped into using tap method
  - called using call(...params) method

In these type of hooks, each of the plugin callbacks will be invoked one after the other with the specific args

If any value is returned except undefined by any plugin 
- that value is returned by hook
- no further plugin callback is invoked

Examples of SyncBailHooks are:
- optimizeChunks, 
- optimizeChunkModules

---
### Waterfall Hooks
Plugins applied synchronously in the waterfall manner

SyncWaterfallHook[params]
  - tapped into using tap method.
  - called using call( ... params) method

Here each of the plugins are called one after the other with the arguments from the return value of the previous plugin. 
- the plugin must take the order of its execution into account
- it must accept arguments from the previous plugin that was executed.
- the value for the first plugin is init
  - hence at least 1 param must be supplied for waterfall hooks
  
This pattern is used in the Tapable instances which are related to the webpack templates like 
- ModuleTemplate, 
- ChunkTemplate etc

---
### Asynchronous Hooks
Plugins applied asynchronously 

AsyncSeriesHook[params]
- tapped into using tap/tapAsync/tapPromise method.
- called using callAsync( ... params) method

The plugin handler functions are called with all arguments and a callback function with the signature (err?: Error) -> void. 

The handler functions are called in order of registration. callback is called after all the handlers are called. 

This is also a commonly used pattern for events like emit, run.

---
### Async waterfall 
Plugins applied asynchronously in the waterfall manner

AsyncWaterfallHook[params]
- tapped into using tap/tapAsync/tapPromise method
- called using callAsync( ... params) method

The plugin handler functions are called with the current value and a callback function with the signature (err: Error, nextValue: any) -> void. 

When called, nextValue is the current value for the next handler. 

The current value for the first handler is init. After all handlers are applied, callback is called with the last value. If any handler passes a value for err, the callback is called with this error and no more handlers are called. 

This plugin pattern is expected for events like 
- before-resolve  
- after-resolve

---
### Async Series Bail
Plugins applied asynchronously with bail
- AsyncSeriesBailHook[params]
- tapped into using tap/tapAsync/tapPromise method
- called using callAsync( ... params) method

---
### Async Parallel
Plugins applied asynchronously in parallel

- AsyncParallelHook[params]
- tapped into using tap/tapAsync/tapPromise method
- called using callAsync( ... params) method

---
### List of hook to tap into

https://webpack.js.org/api/compiler-hooks/

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Writing an async plugin


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Writing a plugin





