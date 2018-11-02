'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ctxDir = path.resolve(__dirname);
const srcDir = path.resolve(ctxDir, 'src');
const outDir = path.resolve(ctxDir, 'dist');
const vendorDir = path.resolve(ctxDir, 'vendor');
const loadersDir = path.resolve(ctxDir, 'loaders');
const publicDir = path.resolve(ctxDir, 'public');

const publicPath = '/';

module.exports = {
    context: ctxDir,
    entry: {
        main: ['normalize.css', srcDir],
        lib: [
            '@babel/polyfill',
            'react', 'react-dom',
            'react-router', 'react-router-dom'
        ]
    },
    output: {
        path: outDir,
        publicPath,
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            'src': srcDir,
            'vendor': vendorDir,
            'public': publicDir
        }
    },
    resolveLoader: {
        alias: {
            '>': loadersDir
        }
    },
    module: {
        rules: [{
            include: [publicDir],
            use: [{
                loader: '>/public-loader',
                options: {
                    publicPath,
                    publicDir
                }
            }]
        }, {
            test: /\.css$/,
            include: [vendorDir, /node_modules/],
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            }, {
                loader: 'postcss-loader'
            }]
        }, {
            test: /\.less$/,
            include: [vendorDir, /node_modules/],
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    importLoaders: 2
                }
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'less-loader'
            }]
        }, {
            test: /\.css$/,
            include: [srcDir],
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[local]-[hash:base64:5]',
                    importLoaders: 1
                }
            }, {
                loader: 'postcss-loader'
            }]
        }, {
            test: /\.less$/,
            include: [srcDir],
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[local]-[hash:base64:5]',
                    importLoaders: 2
                }
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'less-loader'
            }]
        }, {
            test: /\.js$/,
            include: [
                srcDir,
                // https://github.com/webpack/loader-utils/issues/92
                /node_modules\/loader-utils/
            ],
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }]
        }, {
            test: /\.js$/,
            enforce: 'pre',
            exclude: /node_modules/,
            use: ['eslint-loader']
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|jpg|ico)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }]
        }]
    },
    optimization: {
        runtimeChunk: 'single'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};
