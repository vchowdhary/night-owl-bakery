'use strict';

const path = require('path');

const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProgressBar = require('progress');

if (process.argv.length < 3) {
    throw new Error('Missing action argument');
}

const action = process.argv[2];

const webpackConfig = (function getWebpackConfig(act) {
    switch (act) {
        case 'production':
            return require('./webpack.config.production.js');
        case 'development':
            return require('./webpack.config.js');
        default:
            throw new Error(`Unknown action "${act}"`);
    }
}(action));

const webpackCompiler = webpack(webpackConfig);

const webpackStats = {
    colors: true,
    timings: true,
    cached: false
};

const webpackBuildFinished = (err, stats) => {
    if (err) {
        throw err;
    }

    console.log(stats.toString(webpackStats));
};

const webpackProgress = new ProgressBar(
    '[:bar] :percent eta :etas  :msg', {
        total: 100, complete: '=', incomplete: ' ', width: 10
    }
);

new ProgressPlugin((percent, msg) => {
    webpackProgress.update(percent, { msg });
}).apply(webpackCompiler);

switch (action) {
    case 'production':
        webpackCompiler.run(webpackBuildFinished);
        return;
    default:
        break;
}

const config = {
    hostname: 'localhost',
    port: 3000,
    staticPaths: [],
    middlewares: [
        require('webpack-dev-middleware')(webpackCompiler, {
            publicPath: webpackConfig.output.publicPath,
            stats: webpackStats
        }),
        require('webpack-hot-middleware')(webpackCompiler)
    ]
};


if (process.argv[3]) {
    const serverConfigPath = path.resolve(process.argv[3]);
    Object.assign(config, require(serverConfigPath));
}

require('.')(config)
    .catch(err => {
        console.error(err);
        process.exit(1);    // eslint-disable-line no-process-exit
    });

