/**
 * Signup page.
 *
 * @module src/routes/signup
 */

import React from 'react';
import { shape, string, func } from 'prop-types';
import { hot } from 'react-hot-loader';
import { Redirect } from 'react-router-dom';

import User from 'src/User';

import Basic from './Basic';
import Account from './Account';

import styles from './index.less';

/**
 * Signup page.
 *
 * @alias module:src/routes/signup
 */
class Signup extends React.Component {
    /**
     * Initializes the component.
     *
     * @param {Object} props - The component's props.
     */
    constructor(props) {
        super(props);

        const { loggedIn } = User;

        const loading = loggedIn === null;
        const redirect = loggedIn === true;

        this.state = {
            loading,
            redirect,
            message: null
        };

        [
            'onAccountSubmit'
        ].forEach(key => {
            this[key] = this[key].bind(this);
        });

        if (loading) {
            (async() => {
                await User.refreshLoginStatus();
                this.setState({
                    loading: false,
                    redirect: User.loggedIn
                });
            })();
        }
    }

    /**
     * Handles account form submission.
     *
     * @private
     * @param {string} username - The username.
     * @param {string} password - The password.
     */
    onAccountSubmit(username, password) {
        const { data } = this.state;
        this.setState({ loading: true });
        this.signup(username, password, data);
    }

    /**
     * The current location state.
     *
     * @private
     * @readonly
     * @type {Object}
     */
    get locationState() {
        const { location } = this.props;

        return location.state || {
            referer: { pathname: location.pathname }
        };
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        if (this.state.redirect) {
            const { referer } = this.locationState;
            return <Redirect to={referer} />;
        }

        const {
            locationState,
            onAccountSubmit
        } = this;

        const {
            loading,
            message
        } = this.state;

        return <div className={styles.signup}>
            <Basic
                disabled={loading}
            />
            <Account
                defaultUsername={locationState.username}
                defaultPassword={locationState.password}
                disabled={loading}
                onSubmit={onAccountSubmit}
                message={message}
            />
        </div>;
    }

    /**
     * Attempts to sign up with the given account information.
     *
     * @private
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @param {Object} data - Other account information.
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async signup(username, password, data) {
        try {
            await User.signup(username, password, data);

            this.setState({ loading: false, redirect: true, message: null });

            return null;
        } catch (err) {
            const message = <p className={styles.error}>
                Signup failed: {err.message}
            </p>;

            this.setState({ loading: false, message });

            return err;
        }
    }
}

Signup.propTypes = {
    className: string,
    onClick: func,
    location: shape({
        state: shape({
            referer: shape({
                pathname: string.isRequired
            }).isRequired
        }),
        pathname: string.isRequired
    }).isRequired
};

export default hot(module)(Signup);

