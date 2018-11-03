/**
 * Site-wide login page.
 *
 * @module src/Login
 */

import React from 'react';
import { func, shape, string } from 'prop-types';
import { Redirect } from 'react-router-dom';
import Octicon, { SignIn, Plus } from '@githubprimer/octicons-react';
import classNames from 'classnames';

import User from 'src/User';
import Spinner from 'src/Spinner';

import styles from './index.less';

/**
 * Login React component.
 */
export default class Login extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        const { loggedIn } = User;

        const loading = loggedIn === null;
        const redirect = loggedIn === true;

        this.state = {
            loading,
            redirect,
            username: '',
            password: '',
            message: null
        };

        [
            'onSubmit',
            'onUsernameChange',
            'onPasswordChange',
            'onSignupClick'
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
     * Handles form submission.
     *
     * @private
     *
     * @param {Event} event - The event.
     */
    onSubmit(event) {
        event.preventDefault();

        const { username, password } = this.state;

        this.setState({ loading: true, password: '' });
        this.login(username, password);
    }

    /**
     * Handles username change.
     *
     * @private
     *
     * @param {Event} event - The event.
     */
    onUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    /**
     * Handles password change.
     *
     * @private
     *
     * @param {Event} event - The event.
     */
    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    /**
     * Handles signup click.
     *
     * @private
     */
    onSignupClick() {
        const { history } = this.props;
        const { referer } = this.locationState;

        const { username, password } = this.state;
        history.push('/signup/', {
            referer, username, password
        });
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const {
            onSubmit,
            onUsernameChange,
            onPasswordChange,
            onSignupClick
        } = this;

        const {
            className, onClick
        } = this.props;

        const {
            loading, redirect, message,
            username, password
        } = this.state;

        if (redirect) {
            const { referer } = this.locationState;
            return <Redirect to={referer} />;
        }

        const classes = classNames(styles.login, className);

        return <form
            className={classes}
            onClick={onClick}
            onSubmit={onSubmit}
        >
            {loading ? <Spinner /> : null}
            <input
                type="username"
                placeholder="Username"
                required={true}
                disabled={loading}
                value={username}
                onChange={onUsernameChange}
            />
            <input
                type="password"
                placeholder="Password"
                required={true}
                disabled={loading}
                value={password}
                onChange={onPasswordChange}
            />
            <button
                type="submit"
                disabled={loading}
            >
                <Octicon icon={SignIn} />
                &nbsp;Log in
            </button>
            <button
                disabled={loading}
                onClick={onSignupClick}
            >
                <Octicon icon={Plus} />
                &nbsp;Sign up
            </button>
            {message}
        </form>;
    }

    /**
     * Attempts to log in with the given credentials.
     *
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async login(username, password) {
        try {
            await User.login(username, password);

            this.setState({ loading: false, redirect: true, message: null });

            return null;
        } catch (err) {
            const message = <p className={styles.error}>
                Login failed: {err.message}
            </p>;

            this.setState({ loading: false, message });

            return err;
        }
    }
}

Login.propTypes = {
    className: string,
    onClick: func,
    location: shape({
        state: shape({
            referer: shape({
                pathname: string.isRequired
            }).isRequired
        }),
        pathname: string.isRequired
    }).isRequired,
    history: shape({
        push: func.isRequired
    }).isRequired
};

