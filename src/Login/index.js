/**
 * Site-wide login page.
 *
 * @module src/Login
 */

import React from 'react';
import { func, shape, string } from 'prop-types';
import { Redirect } from 'react-router-dom';
import Octicon, { SignIn, Plus } from '@githubprimer/octicons-react';

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
            message: null
        };

        this.inputs = {
            username: null,
            password: null
        };

        this.login = this.login.bind(this);

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
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { onClick, location, history } = this.props;
        const { loading, redirect, message } = this.state;

        if (redirect) {
            const { referer } = location.state || {
                referer: { pathname: '/' }
            };
            return <Redirect to={referer} />;
        }

        return <form
            className={styles.login}
            onClick={onClick}
            onSubmit={async(event) => {
                event.preventDefault();

                const { username, password } = this.inputs;
                const usernameValue = username.value;
                const passwordValue = password.value;
                password.value = '';

                this.setState({ loading: true });
                await this.login(usernameValue, passwordValue);
                this.setState({ loading: false });
            }}
        >
            {loading ? <Spinner /> : null}
            <input
                type='username'
                ref={input => (this.inputs.username = input)}
                placeholder='Username'
                required={true}
                disabled={loading}
            />
            <input
                type='password'
                ref={input => (this.inputs.password = input)}
                placeholder='Password'
                required={true}
                disabled={loading}
            />
            <fieldset>
                <button
                    type='submit'
                    disabled={loading}
                >
                    <Octicon icon={SignIn} />
                    &nbsp;Log in
                </button>
                <button
                    disabled={loading}
                    onClick={() => {
                        history.push('/signup/');
                    }}
                >
                    <Octicon icon={Plus} />
                    &nbsp;Sign up
                </button>
                {message}
            </fieldset>
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

            this.setState({ redirect: true, message: null });

            return null;
        } catch (err) {
            const message = <p className={styles.error}>
                Login failed: {err.message}
            </p>;

            this.setState({ message });

            return err;
        }
    }
}

Login.propTypes = {
    onClick: func,
    location: shape({
        state: shape({
            referer: shape({
                pathname: string.isRequired
            }).isRequired
        })
    }).isRequired,
    history: shape({
        push: func.isRequired
    }).isRequired
};

