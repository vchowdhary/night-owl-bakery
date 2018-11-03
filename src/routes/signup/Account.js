/**
 * Account signup form.
 *
 * @module src/routes/signup/Account
 */

import React from 'react';
import { func, string, bool, node } from 'prop-types';
import Octicon, { Plus } from '@githubprimer/octicons-react';

import LabeledInput from 'src/LabeledInput';

import logoImage from 'public/images/logo-notext.svg';

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
 * Account signup form.
 *
 * @alias module:src/routes/signup/Account
 */
class SignupAccount extends React.Component {
    /**
     * Initializes the component.
     *
     * @param {Object} props - The component's props.
     */
    constructor(props) {
        super(props);

        const {
            defaultUsername = '',
            defaultPassword = ''
        } = this.props;

        this.state = {
            username: defaultUsername,
            password: defaultPassword
        };

        [
            'onSubmit',
            'onUsernameChange',
            'onPasswordChange'
        ].forEach(key => {
            this[key] = this[key].bind(this);
        });
    }

    /**
     * Handles form submission.
     *
     * @private
     * @param {Event} event - The event.
     */
    onSubmit(event) {
        event.preventDefault();

        const { username, password } = this.state;
        if ('onSubmit' in this.props) {
            this.props.onSubmit(username, password);
        }
    }

    /**
     * Handles username change.
     *
     * @private
     * @param {Event} event - The event.
     */
    onUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    /**
     * Handles password change.
     *
     * @private
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
            disabled,
            message
        } = this.props;

        const {
            username, password
        } = this.state;

        return <form onSubmit={onSubmit}>
            <section>
                <img src={logoImage} />
                <div>
                    <h4>Finally, let&rsquo;s set up your account.</h4>
                    <h5>Welcome to the Bakery!</h5>
                </div>
            </section>
            <LabeledInput
                type="username"
                label="Username"
                maxLength={USERNAME_MAXLEN}
                required={true}
                disabled={disabled}
                value={username}
                onChange={onUsernameChange}
            />
            <LabeledInput
                type="password"
                label="Password"
                maxLength={PASSWORD_MAXLEN}
                required={true}
                disabled={disabled}
                value={password}
                onChange={onPasswordChange}
            />
            <button
                type="submit"
                disabled={disabled}
            >
                <Octicon icon={Plus} />
                &nbsp;Sign up
            </button>
            {message}
        </form>;
    }
}

SignupAccount.propTypes = {
    defaultUsername: string,
    defaultPassword: string,
    disabled: bool,
    onSubmit: func,
    message: node
};

export default SignupAccount;

