/**
 * App header.
 *
 * @module src/App/Header
 */

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Octicon, { Plus } from '@githubprimer/octicons-react';

import User from 'src/User';
import LoginLink from 'src/Login/Link';
import Logout from 'src/Logout';

import styles from './index.less';

/**
 * Logo component.
 *
 * @private
 *
 * @returns {ReactElement} The component's elements.
 */
function Logo() {
    return <NavLink
        className={styles.logo}
        activeClassName={styles.active}
        to="/"
    >
        <div className={styles.image} />
        <div className={styles.text} />
    </NavLink>;
}

/**
 * Account toolbar component.
 *
 * @private
 *
 * @returns {ReactElement} The component's elements.
 */
function Account() {
    if (!User.loggedIn) {
        return <nav>
            <Link to="/signup/">
                <Octicon icon={Plus} />
                &nbsp;Sign up
            </Link>
            <LoginLink />
        </nav>;
    }

    return <nav>
        <Logout />
    </nav>;
}

/**
 * Header component.
 *
 * @alias module:src/Header
 *
 * @returns {ReactElement} The component's elements.
 */
function Header() {
    return <header className={styles.header}>
        <Logo />
        <Account />
    </header>;
}

export default Header;

