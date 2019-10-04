# Lazy Loading

---
### Lazy Loading

Lazy, or "on demand", loading is a great way to optimize your site or application
- splitting your code at logical breakpoints, and loading it once the user has done something that requires, or will require, a new block of code
- speeds up the initial load of the application
- lightens its overall weight as some blocks may never even be loaded

---
### Example
Let's add an interaction to log some text to the console when the user clicks a button.

However, we'll wait to load that code (print.js) until the interaction occurs for the first time

---
### Example
project
```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
  |- print.js
|- /node_modules
```
src/print.js
```
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
};
```

---
### Example (2)
src/index.js
```
  import _ from 'lodash';

 function component() {
    const element = document.createElement('div');
    const button = document.createElement('button');
    const br = document.createElement('br');

    button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.appendChild(br);
    element.appendChild(button);

    // Note that because a network request is involved, some indication
    // of loading would need to be shown in a production-level site/app.
    button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
      const print = module.default;
      print();
    });

    return element;
  }

  document.body.appendChild(component());

```

Note that when using import() on ES6 modules you must reference the .default property as it's the actual module object that will be returned when the promise is resolved.

---
### Example (2)

Now let's run webpack and check out our new lazy-loading functionality:
```
...
          Asset       Size  Chunks                    Chunk Names
print.bundle.js  417 bytes       0  [emitted]         print
index.bundle.js     548 kB       1  [emitted]  [big]  index
     index.html  189 bytes          [emitted]
...
```

---
### Frameworks
Many frameworks and libraries have their own recommendations on how this should be accomplished within their methodologies.

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





