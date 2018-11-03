/**
 * Signup page.
 *
 * @module src/routes/signup
 */

import React from 'react';
import { hot } from 'react-hot-loader';
import { shape, string } from 'prop-types';
import { Redirect } from 'react-router-dom';
import Octicon, { Plus } from '@githubprimer/octicons-react';

import User from 'src/User';
import Spinner from 'src/Spinner';
import LabeledInput from 'src/LabeledInput';

import styles from './index.less';

/**
 * Maximum username length.
 *
 * @private
 * @readonly
 * @type {number}
 */
const USERNAME_MAXLEN = 255;

/**
 * Maximum password length.
 *
 * @private
 * @readonly
 * @type {number}
 */
const PASSWORD_MAXLEN = 72;

/**
 * Signup form.
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

        const {
            username = '',
            password = ''
        } = this.locationState;

        this.state = {
            loading,
            redirect,
            username,
            password,
            message: null
        };

        [
            'onSubmit',
            'onUsernameChange',
            'onPasswordChange'
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

        this.setState({ loading: true });
        this.signup(username, password);
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
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const {
            onSubmit,
            onUsernameChange,
            onPasswordChange
        } = this;

        const {
            loading, redirect, message,
            username, password
        } = this.state;

        if (redirect) {
            const { referer } = this.locationState;
            return <Redirect to={referer} />;
        }

        return <form
            className={styles.signup}
            onSubmit={onSubmit}
        >
            {loading ? <Spinner /> : null}
            <LabeledInput
                type="username"
                label="Username"
                maxLength={USERNAME_MAXLEN}
                required={true}
                disabled={loading}
                value={username}
                onChange={onUsernameChange}
            />
            <LabeledInput
                type="password"
                label="Password"
                maxLength={PASSWORD_MAXLEN}
                required={true}
                disabled={loading}
                value={password}
                onChange={onPasswordChange}
            />
            <button
                type="submit"
                disabled={loading}
            >
                <Octicon icon={Plus} />
                &nbsp;Sign up
            </button>
            {message}
        </form>;
    }

    /**
     * Attempts to sign up with the given information.
     *
     * @param {string} id - The login ID.
     * @param {string} password - The password.
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async signup(id, password) {
        try {
            await User.signup(id, password);

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
    location: shape({
        state: shape({
            referer: shape({
                pathname: string.isRequired
            }).isRequired,
            username: string,
            password: string
        }),
        pathname: string.isRequired
    }).isRequired
};

export default hot(module)(Signup);

