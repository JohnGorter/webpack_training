# Context

---
### Context...

- History and Future of Webpack
- Community and Team
- Comparision with the others

---
### From Wikipedia

> Webpack is an open-source JavaScript module bundler. It is a module bundler primarily for JavaScript, but it can transform front-end assets like HTML, CSS, and images if the corresponding plugins are included. Webpack takes modules with dependencies and generates static assets representing those modules. 


Wat does this mean?

---
### History of JavaScript Bundlers
2013 - Browserify hit the scene 
  - non-concatenation bundlers start to go mainstream
  - wasn’t designed to solve the problem of bundling
  - it was designed to solve the problem of Node developers who wanted to reuse their code in the browser

---
### History of JavaScript Bundlers (2)

2014 - npm had already grown to over 50,000 modules
  - the idea of reusing those modules within browser code was a compelling proposition
  - the problem Browserify solved was thus twofold:
    - make the CommonJS module system work for the browser by crawling the dependency tree, reading files, and building a single bundle file
  - make Node built-ins and conventions (process, Buffer, crypto, etc.) work in the browser, by implementing polyfills and shims for them

---
### History of JavaScript Bundlers (3)

2015 - Webpack rose to prominence
  - buoyed by the popularity of React and the endorsement of Pete Hunt
  - Webpack’s initial focus was a bit different from Browserify’s
  - Browserify’s goal was to make Node modules run in the browser
  - Webpack’s goal was to create a dependency graph for all of the assets in a website 
  



---
### Other Similar Web frameworks

- Rollup
- Parcel
- FuseBox 
- Brunch
- JSPM

comparison chart here: 
https://webpack.js.org/comparison/




