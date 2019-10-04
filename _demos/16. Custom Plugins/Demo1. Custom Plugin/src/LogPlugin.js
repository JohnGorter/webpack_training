class LogPlugin {
    apply(compiler) {
      // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
      compiler.hooks.compile.tap('MyPlugin', (params) => {
        /* ... */
        console.log("params", params); 
      });
    }
  }
  
  module.exports = LogPlugin;