const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        publicPath: '/js/',
		contentBase: path.join(__dirname, 'public'),
		openPage: "", //?group_id=1&multiplier=1&server=true",
        port: 3000
    },
});
