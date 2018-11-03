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

import styles from './index.less';

/**
 * Signup form.
 *
 * @alias module:src/routes/signup
 */
class Signup extends React.Component {
    /**
     * Initializes the signup form.
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
        const { location } = this.props;
        const { loading, redirect, message } = this.state;

        const locationState = location.state || {
            referer: { pathname: '/' }
        };

        if (redirect) {
            const { referer } = locationState;
            return <Redirect to={referer} />;
        }

        return <form
            className={styles.signup}
            onSubmit={async(event) => {
                event.preventDefault();

                const {
                    username,
                    password
                } = this.inputs;

                this.setState({ loading: true });
                await this.signup(
                    username.value,
                    password.value
                );
                this.setState({ loading: false });
            }}
        >
            <input
                type="username"
                ref={input => (this.inputs.username = input)}
                defaultValue={locationState.username}
                placeholder="Username"
                required={true}
                disabled={loading}
            />
            <input
                type="password"
                ref={input => (this.inputs.password = input)}
                defaultValue={locationState.password}
                placeholder="Password"
                required={true}
                disabled={loading}
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
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async signup(username, password) {
        try {
            void username;
            void password;
            throw new Error('Unimplemented!');

            /*
            this.setState({ redirect: true, message: null });

            return null;
            */
        } catch (err) {
            const message = <p className={styles.error}>
                Signup failed: {err.message}
            </p>;

            this.setState({ message });
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
        })
    }).isRequired
};

export default hot(module)(Signup);

