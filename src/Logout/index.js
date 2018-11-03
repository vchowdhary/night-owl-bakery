/**
 * Logout button.
 *
 * @module src/Logout
 */

import React from 'react';
import { string, shape, func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import Octicon, { SignOut } from '@githubprimer/octicons-react';

import User from 'src/User';

/**
 * Logout React component.
 *
 * @alias module:src/Logout
 *
 * @param {Object} props - The component's props.
 * @param {string} [props.className] - Button class.
 * @param {Object} props.history - Router history.
 * @returns {ReactElement} The component's elements.
 */
function Logout(props) {
    const { className, history } = props;

    return <button
        className={className}
        disabled={!User.loggedIn}
        onClick={async() => {
            try {
                await User.logout();

                history.go(0);
            } catch (err) {
                console.log(err);
            }
        }}>
        Log out&nbsp;
        <Octicon icon={SignOut} />
    </button>;
}

Logout.propTypes = {
    className: string,
    history: shape({
        push: func.isRequired
    }).isRequired
};

const LogoutWithRouter = withRouter(Logout);
export default LogoutWithRouter;

