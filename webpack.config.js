const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
  	path: path.resolve(__dirname, './'),
  	filename: 'bundle.js'
  },
  module: {
  	rules: [
  		{
  			test: /\.js$/, use: 'babel-loader', exclude: /node_modules/
  		}
  	]
  },
  plugins: [
  	new HtmlWebpackPlugin({
  		template: './index.html',
  		inject: 'body' 
  	})
  ]
};