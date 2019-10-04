# Writing Loaders

---
###  Writing Loaders

A loader is
- a node module that exports a function
- called when a resource should be transformed

The given function will have access to the Loader API using the this context provided to it.


---
### Setup

To test a single loader, you can simply use path to resolve a local file within a rule object:

webpack.config.js
```
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve('path/to/loader.js'),   // <--
            options: {/* ... */}
          }
        ]
      }
    ]
  }
};
```

---
### Simple Usage
When a single loader is applied to the resource, the loader is called with
- a string containing the content of the resource file

Synchronous loaders can simply return a single value representing the transformed module.

The loader can return any number of values by using the this.callback(err, values...) function. 

Errors are either passed to the this.callback function or thrown in a sync loader

The loader is expected to give back one or two values:
- a resulting JavaScript code as string or buffer
- second optional value is a SourceMap as JavaScript object

---
### Complex Usage
When multiple loaders are chained, they are executed in reverse order 
- either right to left or bottom to top depending on array format

- The last loader, called first, will be passed the contents of the raw resource.
- The first loader, called last, is expected to return JavaScript and an optional source map.
- The loaders in between will be executed with the result(s) of the previous loader in the chain.

---
### Example

- the foo-loader would be passed the raw resource 
- the bar-loader would receive the output of the foo-loader and return the final transformed module and a source map if necessary

webpack.config.js
```
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          'bar-loader',
          'foo-loader'
        ]
      }
    ]
  }
};
```

---
### Guidelines
The following guidelines should be followed when writing a loader:
- Keep them simple.
- Utilize chaining.
- Emit modular output.
- Make sure they're stateless.
- Employ loader utilities.
- Mark loader dependencies.
- Resolve module dependencies.
- Extract common code.
- Avoid absolute paths.
- Use peer dependencies.


---
### Simple
Loaders should do only a single task. 
- easier maintainance
- allows for chaining in more scenarios

---
### Chaining
Instead of writing a single loader that tackles five tasks, 
write five simpler loaders that divide this effort

Examples of community loaders:
- jade-loader: Convert template to a module that exports a function.
- apply-loader: Executes the function with loader options and returns raw HTML.
- html-loader: Accepts HTML and outputs a valid JavaScript module.

The fact that loaders can be chained also means they don't necessarily have to output JavaScript 

As long as the next loader in the chain can handle its output, the loader can return any type of module

---
### Modular
Keep the output modular

Loader generated modules should respect the same design principles as normal modules

---
### Stateless
Make sure the loader does not retain state between module transformations

Each run should always be independent of other compiled modules as well as previous compilations of the same module

---
### Loader Utilities
Take advantage of the loader-utils package
It provides a variety of useful tools but one of the most common is retrieving the options passed to the loader

Along with loader-utils, the schema-utils package should be used for consistent JSON Schema based validation of loader options. Here's a brief example that utilizes both:

loader.js
```
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

export default function(source) {
  const options = getOptions(this);

  validateOptions(schema, options, 'Example Loader');

  // Apply some transformations to the source...

  return `export default ${ JSON.stringify(source) }`;
}
```

---
### Loader Dependencies

If a loader uses external resources (i.e. by reading from filesystem), they must indicate it

This information is used to invalidate cacheable loaders and recompile in watch mode

Here's a brief example of how to accomplish this using the addDependency method:

loader.js
```
import path from 'path';

export default function(source) {
  var callback = this.async();
  var headerPath = path.resolve('header.js');

  this.addDependency(headerPath);

  fs.readFile(headerPath, 'utf-8', function(err, header) {
    if(err) return callback(err);
    callback(null, header + '\n' + source);
  });
}
```

---
### Module Dependencies
Depending on the type of module, there may be a different schema used to specify dependencies. In CSS for example, the @import and url(...) statements are used. These dependencies should be resolved by the module system.

This can be done in one of two ways:

- by transforming them to require statements
Using the this.resolve function to resolve the path.
The css-loader is a good example of the first approach. It transforms dependencies to requires, by replacing @import statements with a require to the other stylesheet and url(...) with a require to the referenced file.

In the case of the less-loader, it cannot transform each @import to a require because all .less files must be compiled in one pass for variables and mixin tracking. Therefore, the less-loader extends the less compiler with custom path resolving logic. It then takes advantage of the second approach, this.resolve, to resolve the dependency through webpack.

If the language only accepts relative urls (e.g. url(file) always refers to ./file), you can use the tilde convention to specify references to installed modules (e.g. those in node_modules). So, in the case of url, that would look something like url('tildesome-library/image.jpg').

---
### Common Code
Avoid generating common code in every module the loader processes. 

Instead, create a runtime file in the loader and generate a require to that shared module

---
### Absolute Paths
Don't insert absolute paths into the module code as they break hashing when the root for the project is moved

There's a stringifyRequest method in loader-utils which can be used to convert an absolute path to a relative one

---
### Peer Dependencies
If the loader you're working on is a simple wrapper around another package, 
then you should include the package as a peerDependency. 

This approach allows the application's developer to specify the exact version in the package.json if desired.

For instance, the sass-loader specifies node-sass as peer dependency like so:
```
{
  "peerDependencies": {
    "node-sass": "^4.0.0"
  }
}
```

---
### Testing
unit testing your loader 

```
npm install --save-dev jest babel-jest babel-preset-env
```

.babelrc
```
{
  "presets": [[
    "env",
    {
      "targets": {
        "node": "4"
      }
    }
  ]]
}
```

Our loader will process .txt files and simply replace any instance of [name] with the name option given to the loader. Then it will output a valid JavaScript module containing the text as its default export:

src/loader.js
```
import { getOptions } from 'loader-utils';

export default function loader(source) {
  const options = getOptions(this);

  source = source.replace(/\[name\]/g, options.name);

  return `export default ${ JSON.stringify(source) }`;
}
```


We'll use this loader to process the following file:

test/example.txt
```
Hey [name]!
```

We use the Node.js API and memory-fs to execute webpack
```
npm install --save-dev webpack memory-fs
```

test/compiler.js
```
import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: /\.txt$/,
        use: {
          loader: path.resolve(__dirname, '../src/loader.js'),
          options: {
            name: 'Alice'
          }
        }
      }]
    }
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

      resolve(stats);
    });
  });
};
```

Finally, write our test and add an npm script to run it:

test/loader.test.js
```
import compiler from './compiler.js';

test('Inserts name and outputs JavaScript', async () => {
  const stats = await compiler('example.txt');
  const output = stats.toJson().modules[0].source;

  expect(output).toBe('export default "Hey Alice!\\n"');
});
```
package.json
```
{
  "scripts": {
    "test": "jest"
  }
}
```

With everything in place, we can run it and see if our new loader passes the test:
```
 PASS  test/loader.test.js
  ✓ Inserts name and outputs JavaScript (229ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.853s, estimated 2s
Ran all test suites.
```

It worked!

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





