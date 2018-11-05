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
            _refreshLoginStatusPromise: { value: null, writable: true }
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
     * @param {string} id - The login ID.
     * @param {string} password - The password.
     * @returns {module:src/User} Resolves with the user instance on success, or
     * rejects with an error.
     */
    async login(id, password) {
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
        return this;
    }

    /**
     * Attempts to log out.
     *
     * @returns {module:src/User} Resolves with the user instance on success, or
     * rejects with an error.
     */
    async logout() {
        await XHRpromise('DELETE', API, {
            successStatus: 204
        });

        this._id = false;
        return this;
    }

    /**
     * Attempts to sign up a new user.
     *
     * @param {string} id - The login ID.
     * @param {string} password - The password.
     * @param {string} profile - Profile information.
     * @returns {module:src/User} Resolves with the user instance on success, or
     * rejects with an error.
     */
    async signup(id, password, profile) {
        const reqURL = `${API}/${encodeURIComponent(id)}`;

        const { status, response } = await XHRpromise('PUT', reqURL, {
            contentType: 'application/json',
            body: JSON.stringify({ password, profile })
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
        return this;
    }

    /**
     * Attempts to delete the logged-in user.
     *
     * @returns {module:src/User} Resolves with the user instance on success, or
     * rejects with an error.
     */
    async delete() {
        const id = this._id;
        if (!id) {
            throw new Error('Cannot delete account while not logged in!');
        }

        const reqURL = `${API}/${encodeURIComponent(id)}`;

        const { status } = await XHRpromise('DELETE', reqURL);

        switch (status) {
            case 200:
            case 204:
                break;
            default:
                throw new Error('Unknown error occurred.');
        }

        this._id = false;
        return this;
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

