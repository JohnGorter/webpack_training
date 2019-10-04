# Progressive Web Application

---
### Progressive Web Applications

web apps that deliver an experience similar to native applications

There are many things that can contribute to that
- function when offline using Service Workers
- Google Workbox provides tools that help make offline support easier to setup

---
### We Don't Work Offline Now
So far, we've been viewing the output by going directly to the local file system. Typically a real user accesses a web app over a network
  - their browser talking to a server which will serve up the required assets

---
### Setup

So let's test what the current experience is like using a simple server
- use the http-server package
``` 
npm install http-server --save-dev
```

Amend the scripts section of our package.json to add in a start script:

package.json
```
{
  ...
  "scripts": {
    "build": "webpack",
    "start": "http-server dist" // <--
  },
  ...
}
```

Note: webpack DevServer writes in-memory by default
We'll need to enable writeToDisk option in order for http-server to be able to serve files from ./dist directory

---
### Setup(2)

Run the command npm run build to build your project
Then run the command npm start. 

This should produce the following output:

> http-server dist
```
Starting up http-server, serving dist
Available on:
  http://xx.x.x.x:8080
  http://127.0.0.1:8080
  http://xxx.xxx.x.x:8080
Hit CTRL-C to stop the server
```

If you open your browser to http://localhost:8080 (i.e. http://127.0.0.1) you should see your webpack application being served from the dist directory

If you stop the server and refresh, the webpack application is no longer available.

---
### Adding Workbox
Let's add the Workbox webpack plugin and adjust the webpack.config.js file:
```
npm install workbox-webpack-plugin --save-dev
```
webpack.config.js
```
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const WorkboxPlugin = require('workbox-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
    plugins: [
      // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
       title: 'Progressive Web Application',
      }),
     new WorkboxPlugin.GenerateSW({   //<-- 
       // these options encourage the ServiceWorkers to get in there fast
       // and not allow any straggling "old" SWs to hang around
       clientsClaim: true,
       skipWaiting: true,
     }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

With that in place, let's see what happens when we do an npm run build:

---
### Adding Workbox (2)
```
...
                  Asset       Size  Chunks                    Chunk Names
          app.bundle.js     545 kB    0, 1  [emitted]  [big]  app
        print.bundle.js    2.74 kB       1  [emitted]         print
             index.html  254 bytes          [emitted]
precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js  268 bytes          [emitted]
      service-worker.js       1 kB          [emitted]
...
```

As you can see, we now have 2 extra files being generated
- service-worker.js
- precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js

So we're now at the happy point of having produced a Service Worker. What's next?

---
### Registering Our Service Worker
Let's register our Service Worker 

index.js
```
  import _ from 'lodash';
  import printMe from './print.js';

 if ('serviceWorker' in navigator) {   // <--
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('/service-worker.js').then(registration => {
       console.log('SW registered: ', registration);
     }).catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
     });
   });
 }
```

Once more npm run build to build a version of the app including the registration code. 

Then serve it with npm start. Navigate to http://localhost:8080 and take a look at the console. Somewhere in there you should see:
```
SW registered
```


---
### Conclusion
You have built an offline app using the Workbox project. You've started the journey of turning your web app into a PWA.

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Adding WorkBox



---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Creating a PWA




