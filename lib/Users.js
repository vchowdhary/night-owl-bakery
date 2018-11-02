/**
 * User management.
 *
 * @module Users
 */

'use strict';

const { promisify } = require('util');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const Router = require('express-promise-router');
const Sequelize = require('sequelize');

/**
 * Checks if the given string only contains printable ASCII characters.
 *
 * @param {string} str - The string.
 * @returns {boolean} `true` if the string only contains printable ASCII;
 * `false` otherwise.
 */
function isPrintASCII(str) {
    return /^[\x20-\x7F]*$/.test(str);
}

/**
 * Maximum bcrypt password length.
 *
 * @private
 * @readonly
 * @type {number}
 */
const BCRYPT_PW_MAXLEN = 72;

/**
 * Length of bcrypt hash.
 *
 * @private
 * @readonly
 * @type {number}
 */
const BCRYPT_PW_HASHLEN = 60;

/**
 * Number of salt rounds for bcrypt password hashing.
 *
 * @private
 * @readonly
 * @type {number}
 */
const BCRYPT_PW_SALTS = 12;

/**
 * Checks if the request is authenticated.
 *
 * @private
 * @param {express~Request} req - The request.
 * @param {express~Response} res - The response.
 * @param {Function} next - The callback.
 * @returns {void}
 */
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.set('Content-Type', 'text/plain')
        .status(401)
        .end();
}

/**
 * Represents a map of users.
 *
 * @alias module:Users
 */
class Users {
    /**
     * Creates a new user map.
     *
     * @param {Sequelize} sequelize - The Sequelize instance.
     */
    constructor(sequelize) {
        const auth = new passport.Authenticator();

        auth.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password'
        }, async(id, password, done) => {
            try {
                const user = await this.findByID(id);
                if (
                    !user
                    || !await bcrypt.compare(password, user.pwHash)
                ) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }));

        auth.serializeUser(function(user, done) {
            done(null, user.id);
        });

        auth.deserializeUser(async(id, done) => {
            const user = await this.findByID(id);
            return done(null, user);
        });

        const User = sequelize.define(
            'User',
            /** @lends module:Users#User# */ {
                /**
                 * The user's ID.
                 *
                 * @type {string}
                 */
                id: {
                    type: Sequelize.STRING,
                    unique: true,
                    primaryKey: true
                },

                /**
                 * The user's password hash.
                 *
                 * @type {string}
                 */
                pwHash: {
                    type: Sequelize.CHAR(BCRYPT_PW_HASHLEN)
                }
            }
        );

        Object.defineProperties(this, /** @lends module:Users# */ {
            /**
             * Passport authenticator for users.
             *
             * @readonly
             * @type {passport~Authenticator}
             */
            auth: { value: auth },

            /**
             * @classdesc Represents a user.
             *
             * @private
             * @readonly
             * @class
             */
            User: { value: User }
        });
    }

    /**
     * Inserts a new user.
     *
     * @param {string} id - The user's ID.
     * @param {Object} data - The user's metadata.
     * @returns {module:Users#User?} Resolves with the created user instance on
     * success, or `null` if the user could not be created.
     */
    async insert(id, data) {
        if (!data) {
            return null;    // Missing request data.
        }

        for (let key of [
            'password'
        ]) {
            if (!(key in data)) {
                return null;    // Missing key.
            }
        }

        const {
            password
        } = data;

        // Password validation.
        // Note: the order matters! We want to ensure the string only contains
        // printable ASCII so that the length check is reliable (since bcrypt
        // only supports 72-byte passwords).
        if (
            !isPrintASCII(password)
            || password.length > BCRYPT_PW_MAXLEN
        ) {
            return null;    // Bad password.
        }

        const pwHash = await bcrypt.hash(password, BCRYPT_PW_SALTS);

        try {
            return await this.User.create({
                id,
                pwHash
            });
        } catch (err) {
            if (!(err instanceof Sequelize.UniqueConstraintError)) {
                throw err;
            }

            return null;    // User already exists.
        }
    }

    /**
     * Finds a user by their login ID.
     *
     * @param {string} id - The user's login ID.
     * @returns {module:Users#User?} Resolves with the user, or `null` if not
     * found.
     */
    async findByID(id) {
        try {
            return await this.User.findOne({
                where: { id }
            });
        } catch (err) {
            return null;
        }
    }

    /**
     * Creates a new router for the user map.
     *
     * @returns {express~Router} The router.
     */
    router() {
        // Router for a single user.
        const userRouter = Router();

        // Attempts to create a new user.
        userRouter.put(
            '/',
            bodyParser.json(),
            async(req, res) => {
                const { id } = req;
                const data = req.body;

                let status;
                const user = await this.insert(id, data);
                if (user === null) {
                    status = 400;   // Creation failed.
                } else {
                    status = 201;   // User created.

                    // Log the user in immediately.
                    await promisify(req.logIn.bind(req))(user);

                    // Send location of created user.
                    const location = req.originalUrl;
                    res.set('Location', location);
                }

                res.set('Content-Type', 'text/plain')
                    .status(status)
                    .end();
            }
        );

        // Attempts to delete a logged-in user.
        userRouter.delete(
            '/',
            isAuthenticated,
            async(req, res) => {
                const { user } = req;

                req.logOut();
                await user.destroy();

                res.set('Content-Type', 'text/plain')
                    .status(204)
                    .end();
            }
        );

        // Router for this user map instance.
        const router = Router();

        // Checks if the user is authenticated.
        router.get(
            '/',
            isAuthenticated,
            async function(req, res) {
                const { id } = req.user;
                res.json({ id }).end();
            }
        );

        // Attempts to log in a user.
        router.put(
            '/',
            bodyParser.json(),
            (req, res, next) => {
                this.auth.authenticate('local', async function(err, user) {
                    if (err) {
                        return next(err);
                    }

                    let status;
                    if (user) {
                        await promisify(req.logIn.bind(req))(user);
                        status = 204;
                    } else {
                        status = 401;
                    }

                    res.set('Content-Type', 'text/plain')
                        .status(status)
                        .end();
                })(req, res, next);
            }
        );

        // Attempts to log out a user.
        router.delete(
            '/',
            function(req, res) {
                req.logOut();
                res.set('Content-Type', 'text/plain')
                    .status(204)
                    .end();
            }
        );

        // Route each user.
        router.use(
            '/:id([^]+)',
            async function(req) {
                req.id = decodeURIComponent(req.params.id);
                return 'next';
            },
            userRouter
        );

        return router;
    }
}

Object.freeze(Users);
module.exports = Users;

