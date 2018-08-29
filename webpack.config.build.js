const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

    devtool: 'source-map',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js',
        library: 'PlaybackSpeedPlugin',
        libraryTarget: 'umd'
    },

    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]

});
