module.exports = function createDevConfig(answer) {
    let entryProp = answer.entry ? ( '\'' + answer.entry + '\'') : '\'index.js\'';
    let devConfig = {
      entry: entryProp,
      output: {
        filename: '\'[name].js\''
      },
      plugins:[
          createHtmlPlugin(answer.plugin)
      ]
    };
    return devConfig;
  };

 function createHtmlPlugin(name) {
    return (
      ` new HtmlWebpackPlugin({filename: "${name}.html" }) `
    );
  };