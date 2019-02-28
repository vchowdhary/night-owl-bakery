#!/usr/bin/env node

/**
 * Night Owl Bakery server.
 *
 * @module night-owl-bakery
 */

'use strict';

const path = require('path');
const http = require('http');

const express = require('express');
const historyFallback = require('connect-history-api-fallback');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Sequelize = require('sequelize');

const Users = require('./Users');
const MatchQuery = require('./MatchQuery');
const LocationTracking = require('./LocationTracking');
const bodyParser = require('body-parser');

/**
 * Configures Express app settings from the given object.
 *
 * @private
 * @param {express~Application} app - The app to configure.
 * @param {Object} [config] - The configuration.
 */
function configExpress(app, config) {
    if (!config) {
        return;
    }

    Object.keys(config).forEach(key => {
        app.set(key, config[key]);
    });
}

/**
 * Configures user management, authentication, and sessions.
 *
 * @private
 * @param {express~Application} app - The app to configure.
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {string} cookieSecret - Secret for cookies.
 */
function configUsers(app, sequelize, cookieSecret) {
    app.use('/api', session({
        cookie: {
            httpOnly: false,

            // Secure cookies only work for HTTPS, which will only be the case
            // when we are behind a reverse proxy.
            secure: !!app.get('trust proxy')
        },
        secret: cookieSecret,
        store: new SequelizeStore({ db: sequelize }),
        saveUninitialized: false,
        resave: false   // SequelizeStore supports the "touch" method.
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const users = new Users(sequelize);
    const locations = new LocationTracking(sequelize);
    const { auth } = users;

    console.log('setting up apis');
    app.use(auth.initialize());
    app.use(auth.session());
    console.log('setting up users');
    app.use('/api/users', users.router());
    console.log('setting up matches');
    app.use('/api/match', MatchQuery.router(users));
    console.log('setting up location');
    app.use('/api/locationtracking', locations.router());
}

/**
 * Configures static file serving from the given paths.
 *
 * Also enables single-page-app history API fallback.
 *
 * @private
 * @param {express~Application} app - The app to configure.
 * @param {string[]} [staticPaths] - The paths.
 */
function configStatic(app, staticPaths) {
    app.use(historyFallback());

    if (!staticPaths) {
        return;
    }

    staticPaths.forEach(dir => {
        app.use(express.static(dir));
    });

    // Always serve 'public' directory if static files are enabled.
    app.use(express.static(
        path.resolve(__dirname, '../public')
    ));
}

/**
 * Configures a server and starts it.
 *
 * @alias module:night-owl-bakery
 *
 * @param {Object} config - App configuration options.
 *
 * @param {string} config.dataPath - Path to data directory.
 * @param {string} config.cookieSecret - Secret for cookies.
 * @param {string} config.hostname - The server's hostname.
 * @param {number} config.port - The server's listening port.
 * @param {Object} [config.express] - Express app settings.
 * @param {string[]} [config.staticPaths] - Static file paths to serve (no files
 * will be served statically if unspecified).
 * @param {Function[]} [config.middlewares] - Additional middlewares to apply.
 *
 * @returns {http.Server} - Resolve with the listening server.
 */
async function serve(config) {
    const {
        dataPath, cookieSecret, hostname, port
    } = config;

    // Connect to database.
    const sequelize = new Sequelize({
        operatorsAliases: false,
        dialect: 'sqlite',
        storage: path.join(dataPath, 'db.sqlite'),
        define: {
            timestamps: false
        }
    });

    // Configure app.
    console.log("configuring app")
    const app = express();
    configExpress(app, config.express);
    configUsers(app, sequelize, cookieSecret);
    configStatic(app, config.staticPaths);

    // Pull in middlewares from configuration.
    if ('middlewares' in config) {
        app.use.apply(app, config.middlewares);
    }

    // Configuration finalized; synchronize models.
    await sequelize.sync();

    // Start up the server.
    const server = http.createServer(app);
    await new Promise(resolve => {
        server.listen(port, hostname, resolve);
    });

    return server;
}

module.exports = serve;

if (require.main !== module) {
    return;
}

/**
 * The command-line interface of the app.
 *
 * @private
 * @param {string[]} argv - The command-line arguments.
 */
async function cli(argv) {
    // Default configuration.
    const config = {
        hostname: 'localhost',
        port: 3000,
        staticPaths: [
            path.resolve(__dirname, '../dist')
        ]
    };

    if (argv[2]) {
        const configPath = path.resolve(argv[2]);
        console.log("accessing configPath");
        Object.assign(config, require(configPath));
        console.log("assigned configPath to config")
    }

    console.log("awaiting server");
    const server = await serve(config);
    console.log("waited for server");
    const { port, address } = server.address();
    console.log(`Listening on ${address}:${port}`);
}

cli(process.argv)
    .catch(err => {
        console.error(err);
        process.exit(1);    // eslint-disable-line no-process-exit
    });

