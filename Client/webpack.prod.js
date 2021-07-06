const path = require('path');
const Uglify = require("uglifyjs-webpack-plugin");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [
        new Uglify({
            uglifyOptions: {
                mangle: {
                    safari10: true
                }
            }
        }),
    ],
});
