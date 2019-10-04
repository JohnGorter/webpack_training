const path = require('path');
const webpack = require('webpack');
module.exports = {
	entry: 'tete',

	output: {
		filename: '[name].js'
	},

	plugins: [new HtmlWebpackPlugin({ filename: 'te.html' })]
};
