var { merge } = require('webpack-merge');
var common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        // Need to watch for changes in the src folder
        watchFiles: ['./src/**/*'],
    },
});