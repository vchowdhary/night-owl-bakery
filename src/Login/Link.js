/**
 * Login link component.
 *
 * @module src/Login/Link
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import Octicon, { SignIn } from '@githubprimer/octicons-react';

import User from 'src/User';

import styles from './Link.less';

/**
 * Login link component.
 *
 * @returns {ReactElement} The component's elements.
 */
function LoginLink() {
    return <NavLink
        className={styles.login}
        activeClassName={styles.active}
        to={User.paths.login}
    >
        Log in&nbsp;
        <Octicon icon={SignIn} />
    </NavLink>;
}

export default LoginLink;

