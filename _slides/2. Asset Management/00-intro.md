# Asset Management

---
### Asset Management

Webpack traditionally bundles JS files

Since 4.0 Webpack can bundle any type of file
- css
- images
- fonts 
- data

Before we can bundle these, we have to use a config file

---
### Webpack.config.js

Here is an example config.js file
```
const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
     filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
  ```

---
### Loading CSS

Install and add the style-loader and css-loader to your module configuration:
```
npm install --save-dev style-loader css-loader
```

change the webpack.config.js
```
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
      ],
    },
  };
```

Any file that ends with .css will be served to the style-loader and the css-loader.

---
### Loading CSS (2)
This enables you to import './style.css' into the file that depends on that styling

When that module is run, a style tag with the stringified css will be inserted into the head of your html file

---
### Loading images

you can install an image loader
```
npm install --save-dev file-loader
```
and update the config to load images
```
 const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
       {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader',
         ],
       },
      ],
    },
  };
```

---
### Image loading (2)
Now import MyImage from './my-image.png' 

- the image will be processed and added to the output directory 
- the MyImage variable will contain the final url of the image 

---
### Loading Fonts

The file and url loaders will take any file you load through them and output it to your build directory, including fonts

```
webpack.config.js

  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'file-loader',
         ],
       },
      ],
    },
  };
```

---
### Loading Fonts (2)
With the loader configured and fonts in place, you can incorporate them via an @font-face declaration.

The local url(...) directive will be picked up by webpack just as it was with the image

```
src/style.css

@font-face {
  font-family: 'MyFont';
  src:  url('./my-font.woff2') format('woff2'),
        url('./my-font.woff') format('woff');
  font-weight: 600;
  font-style: normal;
}

body {
  color: red;
  font-family: 'MyFont';
  background: url('./icon.png');
}
```

---
### Loading Data
Another useful asset that can be loaded is data, like JSON files, CSVs, TSVs, and XML. 

- import Data from './data.json' will work by default
- to import CSVs, TSVs, and XML use the csv-loader and xml-loader

```
npm install --save-dev csv-loader xml-loader
```
```
webpack.config.js

const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
        {
            test: /\.(csv|tsv)$/,
            use: ['csv-loader',],
        },
        {
            test: /\.xml$/,
            use: ['xml-loader',],
        },
        ],
    },
};
```
---
### Loading Data (2)

Add some data files to your project
```
project

  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- data.xml  <--
    |- index.js
  |- /node_modules
```

src/data.xml
```
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Mary</to>
  <from>John</from>
  <heading>Reminder</heading>
  <body>Call Cindy on Tuesday</body>
</note>
```

---
### Loading Data (3)
Now you can import those four types of data (JSON, CSV, TSV, XML) and the Data variable you import it to will contain parsed JSON for easy consumption:

src/index.js
```
  import Data from './data.xml';

  console.log(Data);

```

Re-run the npm run build command and open index.html. If you look at the console in your developer tools, you should be able to see your imported data being logged to the console!


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Asset Management



