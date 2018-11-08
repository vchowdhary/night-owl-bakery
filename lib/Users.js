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

const isAuthenticated = require('./isAuthenticated');

/**
 * Maximum text area length.
 *
 * @private
 * @readonly
 * @type {number}
 */
const TEXTAREA_MAXLEN = 2047;

/**
 * Profile attributes.
 *
 * @private
 */
const ProfileAttrs = Object.freeze(/** @lends module:Users#Profile# */ {
    /**
     * User ID.
     *
     * @type {string}
     * @see {module:Users#User#id}
     */
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
            model: 'User',
            key: 'id'
        }
    },

    /**
     * First name.
     *
     * @type {string}
     */
    nameFirst: { type: Sequelize.STRING, allowNull: false },

    /**
     * Last name.
     *
     * @type {string}
     */
    nameLast: { type: Sequelize.STRING, allowNull: false },

    /**
     * Phone number.
     *
     * @type {string?}
     */
    phone: { type: Sequelize.STRING },

    /**
     * ZIP code.
     *
     * @type {string?}
     */
    zipCode: { type: Sequelize.STRING },

    /**
     * `true` if the user is an employee.
     *
     * @type {boolean}
     */
    isEmployee: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    /**
     * Occupation.
     *
     * @type {string?}
     */
    occupation: { type: Sequelize.STRING },

    /**
     * Birth month.
     *
     * @type {number?}
     */
    birthMonth: {
        type: Sequelize.INTEGER,
        validate: {
            isInt: true,
            min: 1,
            max: 12
        }
    },

    /**
     * Favorite weekend activity.
     *
     * @type {string?}
     */
    weekendActivity: { type: Sequelize.STRING },

    /**
     * Favorite food.
     *
     * @type {string?}
     */
    favoriteFood: { type: Sequelize.STRING },

    /**
     * Favorite thing to watch.
     *
     * @type {string?}
     */
    likeToWatch: { type: Sequelize.STRING },

    /**
     * Favorite thing about Pittsburgh.
     *
     * @type {string?}
     */
    pittsburghFavorite: { type: Sequelize.STRING },

    /**
     * Origin location.
     *
     * @type {string?}
     */
    origin: { type: Sequelize.STRING },

    /**
     * Life motto.
     *
     * @type {string?}
     */
    lifeMotto: { type: Sequelize.STRING },

    /**
     * Extended biography.
     *
     * @type {string?}
     */
    bio: { type: Sequelize.STRING(TEXTAREA_MAXLEN) }
});

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
 * Attempts to hash the given password.
 *
 * @private
 * @param {string} password - The password.
 * @returns {string} Resolves with the password's hash, or rejects on error.
 */
async function hashPassword(password) {
    // Note: the order matters! We want to ensure the string only contains
    // printable ASCII so that the length check is reliable (since bcrypt
    // only supports 72-byte passwords).
    if (!/^[\x20-\x7F]*$/.test(password)) {
        throw new Error('Invalid password.');
    }

    if (password.length > BCRYPT_PW_MAXLEN) {
        throw new Error('Password too long.');
    }

    return await bcrypt.hash(password, BCRYPT_PW_SALTS);
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

        // Create the user model.
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
                    primaryKey: true
                },

                /**
                 * The user's password hash.
                 *
                 * @type {string}
                 */
                pwHash: {
                    type: Sequelize.CHAR(BCRYPT_PW_HASHLEN),
                    allowNull: false
                }
            }
        );

        // Create the user profile model.
        const Profile = sequelize.define(
            'Profile',
            ProfileAttrs
        );

        // All users have a profile.
        User.hasOne(Profile, { foreignKey: 'id', onDelete: 'CASCADE' });

        Object.defineProperties(this, /** @lends module:Users# */ {
            /**
             * Passport authenticator for users.
             *
             * @readonly
             * @type {passport~Authenticator}
             */
            auth: { value: auth },

            /**
             * The Sequelize instance.
             *
             * @private
             * @readonly
             * @type {Sequelize}
             */
            sequelize: { value: sequelize },

            /**
             * @classdesc Represents a user.
             *
             * @private
             * @readonly
             * @class
             */
            User: { value: User },

            /**
             * @classdesc Represents a user's profile.
             *
             * @private
             * @readonly
             * @class
             */
            Profile: { value: Profile }
        });
    }

    /**
     * Inserts a new user.
     *
     * @param {string} id - The user's ID.
     * @param {string} password - The user's password.
     * @param {Object} profile - The user's profile.
     * @returns {module:Users#User} Resolves with the created user instance on
     * success, or rejects with an error.
     */
    async insert(id, password, profile) {
        // Attempt to create a profile instance.
        profile = this.Profile.build(profile);

        // Attempt to hash the password.
        const pwHash = await hashPassword(password);

        try {
            return await this.sequelize.transaction(async(transaction) => {
                const user = await this.User.create({
                    id,
                    pwHash
                }, { transaction });

                await user.setProfile(profile, { transaction });

                return user;
            });
        } catch (err) {
            if (err instanceof Sequelize.UniqueConstraintError) {
                throw new Error(`User "${id}" already exists.`);
            }

            if (err instanceof Sequelize.ValidationError) {
                throw new Error(err.errors.reduce(
                    function(str, error) {
                        return `${str}\n${error.message}`;
                    },
                    'Validation failed:'
                ));
            }

            throw err;
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

                try {
                    const {
                        password,
                        profile
                    } = req.body;
                    if (!password || !profile) {
                        throw new Error('Missing request data.');
                    }

                    const user = await this.insert(
                        id,
                        password,
                        profile
                    );

                    // Log the user in immediately.
                    await promisify(req.logIn.bind(req))(user);

                    // Send location of created user.
                    const location = req.originalUrl;
                    res.set('Location', location);
                    res.set('Content-Type', 'text/plain')
                        .status(201)
                        .end();
                } catch (err) {
                    // Creation failed; report error.
                    res.set('Content-Type', 'text/plain')
                        .status(400)
                        .send(err.message)
                        .end();
                }
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

        // Gets information about the specified user.
        userRouter.get(
            '/',
            async(req, res) => {
                const { id } = req;
                const user = await this.findByID(id);
                if (!user) {
                    res.sendStatus(404).end();
                    return;
                }

                const profile = await user.getProfile();
                res.json(profile).end();
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

