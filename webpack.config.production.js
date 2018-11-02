'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./webpack.config.base.js');

const publicPath = '/';

config.mode = 'production';

config.output.publicPath = publicPath;

if (!config.module) {
    config.module = {};
}

if (config.module.rules) {
    for (const l of config.module.rules) {
        if (l.use === 'style-loader') {
            l.use = MiniCssExtractPlugin.loader;
        } else if (l.use[0] === 'style-loader'
            || l.use[0].loader === 'style-loader')  {
            l.use[0] = MiniCssExtractPlugin.loader;
        }

        if (l.use[0].loader === '>/public-loader') {
            l.use[0].options.publicPath = publicPath;
        }
    }
}

if (!config.optimization) {
    config.optimization = {};
}

// https://github.com/webpack/webpack/issues/537#issuecomment-92436533
config.optimization.minimizer = [
    new UglifyJsPlugin({
        sourceMap: false
    })
];

if (!config.plugins) {
    config.plugins = [];
}

config.plugins.push(
    new CleanWebpackPlugin(['dist'], { verbose: true }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].min.css',
        chunkFilename: '[id].[contenthash].min.css'
    })
);

module.exports = config;

