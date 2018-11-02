/**
 * Logout button.
 *
 * @module src/Logout
 */

import React from 'react';
import { shape, func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import Octicon, { SignOut } from '@githubprimer/octicons-react';

import User from 'src/User';

import styles from './index.less';

/**
 * Logout React component.
 *
 * @alias module:src/Logout
 */
class Logout extends React.PureComponent {
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        return <form className={styles.logout} onSubmit={event => {
            event.preventDefault();
            this.logout();
        }}>
            <button type='submit' disabled={!User.loggedIn}>
                Log out&nbsp;
                <Octicon icon={SignOut} />
            </button>
        </form>;
    }

    /**
     * Attempts to log out.
     *
     * @returns {Promise} Resolves when logout has succeeded, or rejects with an
     * error.
     */
    async logout() {
        const { history } = this.props;

        try {
            await User.logout();

            history.go(0);
        } catch (err) {
            console.log(err);
        }

        return void 0;
    }
}

Logout.propTypes = {
    history: shape({
        push: func.isRequired
    }).isRequired
};

const LogoutWithRouter = withRouter(Logout);
export default LogoutWithRouter;

