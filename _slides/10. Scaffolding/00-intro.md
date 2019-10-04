# Scaffolding

---
###  Scaffolding

Writing advanced configurations to optimize performance is quite hard. 

The init feature is designed to support people that want to create their own configuration or initializing projects that other people create.

---
### Creating a scaffold

Before writing a webpack-cli scaffold, think about what you're trying to achieve. 

Do you want
- a "general" scaffold that could be used by any project or type of app? 
- something focused, like a scaffold that writes both your webpack.config.js and your framework code? 

It's also useful to think about the user experience for your scaffold

---
### Creating a scaffold (2)
webpack-cli offers an interactive experience to customize the output accordingly. 

For example asking questions like: "What is your entry point?".

---
### Writing a scaffold

webpack-scaffold is a utility suite for creating scaffolds

It contains functions that could be used to create a scaffold

---
### Running a scaffold
A scaffold can be executed using webpack-cli init:
```
webpack-cli init <your-scaffold>
```

When the scaffold package is in your local file system you should point init to its path:
```
webpack-cli init path/to/your/scaffold
```
---
### Running a scaffold globally
Or you can create a global module and symlink to the local one:

Using npm
```
cd path/to/my-scaffold
npm link
webpack-cli init my-scaffold
```
Using yarn
```
cd path/to/my-scaffold
yarn link
webpack-cli init my-scaffold
```
---
### Running a scaffold from npm 
If the package is available from npm, its name must begin with webpack-scaffold and can be used by running:
```
webpack-cli init webpack-scaffold-yourpackage
```

---
### Example Scaffold
Let's create our skeleton. 

In order for the webpack CLI to detect our options, we have to define some properties in the constructor.

generator.js
```
const Generator = require('yeoman-generator');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {}
    };
  }
};
```
configuration object has to have one property you name (we named it dev in the snippet above). 

---
### Make it interactive
In order for us to interact with the users, we make use of the prompting method yeoman has

```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {}
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No'])
    ]).then(answer => {
      if (answer['confirm'] === 'Yes') {
        // build the configuration
      }
    });
  }
};
```

---
### Configuring Webpack
So far, we've made an interaction with the user.

Let's try to build a simple webpack configuration that has an entry point, an output, and a context property. 

Define the webpackOptions property in the constructor to keep your scaffold as clean as possible!

```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings'])
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        // build the configuration
      }
    });
  }
};
```

---
### Dev Configurations

To follow good convention, we extract our configuration into another file, named dev-config.js. 

As this is just regular JavaScript, we can make the module a function, and supply our entry as a parameter for us to build up a configuration file from.

dev-config.js
```
module.exports = function createDevConfig(answer) {
  let devConfig = {};
};
```
generator.js
```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings'])
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
      }
    });
  }
};
```

---
### Some more configs
We've now abstracted that part of the code that's probably going to be really big. Let's go ahead and add another question, like asking for an entry point.
```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?')
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
      }
    });
  }
};
```

---
### Some more configs (2)
Let's look at dev-config.js. We have access to user's answers, use them to assign values to desired config properties
- in this case - entry. 

We've also added an output property that has a filename

dev-config.js
```
module.exports = function createDevConfig(answer) {
  let entryProp = answer.entry ? ( '\'' + answer.entry + '\'') : '\'index.js\'';
  let devConfig = {
    entry: entryProp,
    output: {
      filename: '\'[name].js\''
    }
  };
  return devConfig;
};
```

Run webpack init webpack-scaffold-demo, and you should see scaffold working.

---
### Basic Scaffold
let's say we need to use path's join function. 

For this, we use a single quote string. 

By default, the current directory is used, but it's recommended to pass a value in your configuration (context)
- this makes your configuration independent from CWD (current working directory)

```
module.exports = function createDevConfig(answer) {
  let entryProp = answer.entry ? ( '\'' + answer.entry + '\'') : '\'index.js\'';
  let devConfig = {
    entry: entryProp,
    output: {
      filename: '\'[name].js\''
    },
    context: 'path.join(__dirname, "src")'
  };
  return devConfig;
};
```

---
### Add more functionality
Now we are ready to add a plugin. 

For this, let's create an utility for html-webpack-plugin based on the input from the user. 

Start by adding another question to our prompt.
```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
      }
    });
  }
};
```
---
### Create string with name
Now, we've got to create a string with our answer. This is how it looks.
```
module.exports = function createHtmlPlugin(name) {
  return (
    ` new HtmlWebpackPlugin({filename: "${name}.html" }) `
  );
};
```
We've now created a scaffold with entry, output, context and a plugin. 


---
### Defining scopes
In order for webpack to compile, we've got to import 'path' 

For this, we've got to define something called 'topScope' 

 In topScope you can define and import what's needed for your specific use case

generator.js
```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
        this.options.env.configuration.dev.topScope = [
          'const path = require("path")',
          'const webpack = require("webpack")'
        ];
      }
    });
  }
};
```

---
### Configuration nomenclature
We recommend you to name your configuration file something meaningful, like in our case: "penguins". 

To do it, set the this.options.env.configuration.dev.configName to desired string:
```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then(answer => {
      if(answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
        this.options.env.configuration.dev.topScope = [
          'const path = require("path")',
          'const webpack = require("webpack")'
        ];
        this.options.env.configuration.dev.configName = 'pengwings';
      }
    });
  }
};
```

---
### About .yo-rc.json
To write the actual configuration, we need to write to the .yo-rc.json

This is done using the writing lifecycle method built-in by yeoman.
```
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then (answer => {
      if(answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
        this.options.env.configuration.dev.topScope = [
          'const path = require("path")',
          'const webpack = require("webpack")'
        ];
        this.options.env.configuration.dev.configName = 'pengwings';
      }
    });
  }
  writing() {
    this.config.set('configuration', this.options.env.configuration);
  }
};
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
### Demo time!
Writing a scaffold


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Writing a plugin





