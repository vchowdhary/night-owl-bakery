/**
 * Module for representing user state.
 *
 * @module src/User
 */

import XHRpromise from 'src/XHRpromise';

/**
 * API base path.
 *
 * @private
 * @readonly
 * @type {string}
 */
const API = '/api/users/';

/**
 * Paths associated with the user interface.
 *
 * @private
 * @readonly
 * @enum {string}
 */
const UIPaths = {
    /** Login UI. */
    login: '/login/'
};
Object.freeze(UIPaths);

/**
 * Represents user state.
 *
 * @private
 */
class User {
    /**
     * Initializes the authentication state.
     */
    constructor() {
        Object.defineProperties(this, /** @lends User# */ {
            /**
             * ID if logged in; `false` if not logged in; `null` if
             * unknown (i.e., initial refresh not performed).
             *
             * @private
             * @type {(string?|boolean)}
             */
            _id: { value: null, writable: true },

            /**
             * The current login refresh promise, or `null`.
             *
             * @private
             * @type {Promise?}
             */
            _refreshLoginStatusPromise: { value: null, writable: true },

            /**
             * The current login promise, or `null`.
             *
             * @private
             * @type {Promise?}
             */
            _loginPromise: { value: null, writable: true },

            /**
             * The current logout promise, or `null`.
             *
             * @private
             * @type {Promise?}
             */
            _logoutPromise: { value: null, writable: true },

            /**
             * The current signup promise, or `null`.
             *
             * @private
             * @type {Promise?}
             */
            _signupPromise: { value: null, writable: true }
        });
    }

    /**
     * Paths associated with the user interface.
     *
     * @readonly
     * @see module:src/Users~UIPaths
     */
    get paths() {
        return UIPaths;
    }

    /**
     * `true` if logged in; `false` if not logged in; `null` if
     * unknown (i.e., initial refresh not performed).
     *
     * @readonly
     * @type {boolean?}
     */
    get loggedIn() {
        return this.id === null
            ? null
            : !!this.id;
    }

    /**
     * ID if logged in; `false` if not logged in; `null` if
     * unknown (i.e., initial refresh not performed).
     *
     * @readonly
     * @type {(string?|boolean)}
     */
    get id() {
        return this._id;
    }

    /**
     * Refreshes the login status.
     *
     * If an existing refresh request is in progress, its promise is returned
     * instead.
     *
     * @returns {Promise} Resolves with the user instance on completion, or
     * rejects with an error.
     */
    refreshLoginStatus() {
        if (this._refreshLoginStatusPromise) {
            return this._refreshLoginStatusPromise;
        }

        this._refreshLoginStatusPromise = (async() => {
            try {
                const {
                    status, responseText
                } = await XHRpromise('GET', API);

                if (status === 200) {
                    const { id } = JSON.parse(responseText);
                    this._id = id;
                } else {
                    this._id = false;
                }
            } finally {
                this._refreshLoginStatusPromise = null;
            }
        })();
        return this._refreshLoginStatusPromise;
    }

    /**
     * Attempts to log in.
     *
     * If an existing login request is in progress, its promise is returned
     * instead.
     *
     * @param {string} id - The login ID.
     * @param {string} password - The password.
     * @returns {Promise} Resolves with the user instance on success, or rejects
     * with an error.
     */
    login(id, password) {
        if (this._loginPromise) {
            return this._loginPromise;
        }

        this._loginPromise = (async() => {
            try {
                if (this.loggedIn) {
                    return this;
                }

                const { status } = await XHRpromise('PUT', API, {
                    contentType: 'application/json',
                    body: JSON.stringify({ id, password })
                });

                switch (status) {
                    case 200:
                    case 204:
                        break;
                    case 401:
                        throw new Error('Incorrect username/password.');
                    default:
                        throw new Error('Unknown error occurred.');
                }

                this._id = id;
            } finally {
                this._loginPromise = null;
            }

            return this;
        })();
        return this._loginPromise;
    }

    /**
     * Attempts to log out.
     *
     * If an existing logout request is in progress, its promise is returned
     * instead.
     *
     * @returns {Promise} Resolves with the user instance on success, or rejects
     * with an error.
     */
    logout() {
        if (this._logoutPromise) {
            return this._logoutPromise;
        }

        this._logoutPromise = (async() => {
            try {
                await XHRpromise('DELETE', API, {
                    successStatus: 204
                });

                this._id = false;
            } finally {
                this._logoutPromise = null;
            }

            return this;
        })();
        return this._logoutPromise;
    }

    /**
     * Attempts to sign up a new user.
     *
     * If an existing signup request is in progress, its promise is returned
     * instead.
     *
     * @param {string} id - The login ID.
     * @param {string} password - The password.
     * @returns {Promise} Resolves with the user instance on success, or rejects
     * with an error.
     */
    signup(id, password) {
        if (this._signupPromise) {
            return this._signupPromise;
        }

        const reqURL = `${API}/${encodeURIComponent(id)}`;

        this._signupPromise = (async() => {
            try {
                const { status, response } = await XHRpromise('PUT', reqURL, {
                    contentType: 'application/json',
                    body: JSON.stringify({ password })
                });

                switch (status) {
                    case 200:
                    case 201:
                        break;
                    case 400:
                        throw new Error(response);
                    default:
                        throw new Error('Unknown error occurred.');
                }

                this._id = id;
            } finally {
                this._signupPromise = null;
            }

            return this;
        })();
        return this._signupPromise;
    }
}

Object.freeze(User);

/**
 * User state singleton.
 *
 * @alias module:src/User
 * @type {module:src/User~User}
 */
const state = new User();
export default state;

