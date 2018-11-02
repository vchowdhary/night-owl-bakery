/**
 * App header.
 *
 * @module src/App/Header
 */

import React from 'react';
import { string, node } from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import Octicon, { Plus, Person } from '@githubprimer/octicons-react';

import User from 'src/User';
import Login from 'src/Login';
import Logout from 'src/Logout';
import DropdownNav from './DropdownNav';

import styles from './index.less';

const LoginWithRouter = withRouter(Login);

/**
 * Button-based link component.
 *
 * @private
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.history - Router history object.
 * @param {string} props.to - The location to link to.
 * @param {node} props.children - The component's children.
 * @returns {ReactElement} The component's elements.
 */
const ButtonLink = withRouter(function(props) {
    const { history, to, children } = props;

    return <button onClick={() => {
        history.push(to);
    }}>
        {children}
    </button>;
});

ButtonLink.propTypes = {
    to: string.isRequired,
    children: node
};

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
    const title = [
        <Octicon key='icon' icon={Person} />,
        <span key='text'>&nbsp;Account</span>
    ];

    let menu;
    if (User.loggedIn) {
        menu = [
            <Logout key="logout" />
        ];
    } else {
        menu = [
            <LoginWithRouter key="login" onClick={event => {
                event.stopPropagation();
            }} />,
            <ButtonLink key="signup" to="/signup/">
                <Octicon icon={Plus} />
                &nbsp;Sign up
            </ButtonLink>
        ];
    }

    return <nav className={styles.account}>
        <DropdownNav menuClassName={styles.menu} title={title}>
            {menu}
        </DropdownNav>
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

