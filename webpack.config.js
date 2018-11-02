'use strict';

const webpack = require('webpack');
const config = require('./webpack.config.base.js');

if (!config.performance) {
    config.performance = {};
}

config.devtool = 'eval-source-map';

config.mode = 'development';

config.performance.hints = false;

config.output.filename = '[name].js';

config.entry.main.unshift(
    'webpack-hot-middleware/client?reload=true'
);

if (!config.plugins) {
    config.plugins = [];
}

config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
);

module.exports = config;

