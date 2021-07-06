const path = require('path');
const webpack = require('webpack');

module.exports = {
	target: 'web',
	entry: './src/Setup.js',
	output: {
		filename: 'game.js',
		path: path.join(__dirname, 'public', 'js')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)|(lib)/,
				loader: 'babel-loader',
				query: {
					presets: ['env'],
					plugins: ['transform-class-properties'],
				},
				parser: {
				  amd: false
				}
			},
		]
	},
	node: {
		fs: 'empty'
	},
	externals: {
		oimo: true,
		cannon: true,
		earcut: true
	},
	plugins: [
		new webpack.ProvidePlugin({ FastClick: 'fastclick' }),
	],
};
