/**
 * Logout button.
 *
 * @module src/Logout
 */

import React from 'react';
import { shape, func, string } from 'prop-types';
import { withRouter } from 'react-router-dom';
import Octicon, { SignOut } from '@githubprimer/octicons-react';

import User from 'src/User';

/**
 * Logout button.
 *
 * @alias module:src/routes/logout
 *
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function Logout(props) {
    const { history, className } = props;

    return <button
        className={className}
        disabled={!User.loggedIn}
        onClick={async function() {
            await User.logout();
            history.go(0);
        }}
    >
        <Octicon icon={SignOut} />
        &nbsp;Log out
    </button>;
}

Logout.propTypes = {
    history: shape({
        go: func.isRequired
    }).isRequired,
    className: string
};

export default withRouter(Logout);

