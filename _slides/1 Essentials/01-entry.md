# Entry Points

---
### Entry Points

There are multiple ways to define the entry property in your webpack configuration
- Single Entry (Shorthand) Syntax
Usage: entry: string|Array<string>

webpack.config.js
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
is a shorthand for
webpack.config.js
```
module.exports = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
```

There are multiple ways to define the entry property in your webpack configuration
- Single Entry (Shorthand) Syntax


---
### Entry Points
You can pass an array of file path to the entry property
- "multi-main entry"

This is useful when you would like to inject multiple dependent files together and graph their dependencies into one "chunk"

webpack.config.js
```
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
};
```
The object syntax is more verbose. However, this is the most scalable way of defining entry/entries in your application.

---
### Scenarios


Below is a list of entry configurations and their real-world use cases:
- Separate App and Vendor Entries
- Multi Page Application

---
### Separate App and Vendor Entries

In webpack version < 4 it was common to add vendors as a separate entry point to compile it as a separate file (in combination with the CommonsChunkPlugin).

This is discouraged in webpack 4. Instead, the optimization.splitChunks option takes care of separating vendors and app modules and creating a separate file. Do not create an entry for vendors or other stuff that is not the starting point of execution.

---
### Multi Page Application

webpack.config.js
```
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

What does this do? We are telling webpack that we would like 3 separate dependency graphs (like the above example).

Why? In a multi-page application, the server is going to fetch a new HTML document for you. The page reloads this new document and assets are redownloaded. Now you can
- use optimization.splitChunks to create bundles of shared application code between each page. 

Multi-page applications that reuse a lot of code/modules between entry points can greatly benefit from these techniques, as the number of entry points increases

