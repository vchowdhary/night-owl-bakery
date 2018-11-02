/**
 * App header.
 *
 * @module src/App/Header
 */

import React from 'react';
import { object, string, node, bool } from 'prop-types';
import { Route, Link, NavLink } from 'react-router-dom';
import Octicon, { Plus, Person } from '@githubprimer/octicons-react';
import classNames from 'classnames';

import User from 'src/User';
import Dropdown from 'src/Dropdown';
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
 * Dropdown button React component.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.to - The dropdown's target path. Used for routing.
 * @param {ReactNode} props.title - The title for the dropdown.
 * @param {boolean} props.isOpen - Whether or not the dropdown is open.
 * @returns {ReactElement} The component's elements.
 */
function DropdownButton(props) {
    const { to, title, isOpen } = props;

    /**
     * Button React component.
     *
     * @param {Object} buttonProps - The component's props.
     * @param {boolean} match - Whether or not the target path has been matched.
     * @returns {ReactElement} The component's elements.
     */
    function Button(buttonProps) {
        const { match } = buttonProps;
        const classes = classNames(styles.button, {
            [styles.active]: match !== null,
            [styles.open]: isOpen
        });

        return <button
            className={classes}
            onClick={event => event.preventDefault()}
        >
            {title}
        </button>;
    }

    Button.propTypes = {
        match: object
    };

    return <Route path={to}>
        {Button}
    </Route>;
}

DropdownButton.propTypes = {
    to: string.isRequired,
    title: node.isRequired,
    isOpen: bool
};

/**
 * Dropdown menu component.
 *
 * @private
 *
 * @param {Object} props - The component's props.
 * @param {ReactNode} props.title - The title for the dropdown.
 * @param {ReactNode} props.children - The dropdown items.
 * @returns {ReactElement} The component's elements.
 */
function DropdownMenu(props) {
    const { title, children } = props;
    const { enter, enterActive, exit, exitActive } = styles;

    return <Dropdown
        className={styles.dropdown}
        button={<DropdownButton to='/account/' title={title} />}
        transition={{
            appear: true,
            classNames: {
                enter, enterActive, exit, exitActive,
                appear: enter,
                appearActive: enterActive
            },
            timeout: 300
        }}
    >
        {children}
    </Dropdown>;
}

DropdownMenu.propTypes = {
    title: node.isRequired,
    children: node.isRequired
};

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

    const title = [
        <Octicon key='icon' icon={Person} />,
        <span key='text'>&nbsp;Account</span>
    ];

    /**
     * Menu items.
     *
     * @private
     *
     * @returns {ReactElement} The component's elements.
     */
    function Menu() {
        return <div className={styles.menu}>
            <Logout />
        </div>;
    }

    return <DropdownMenu title={title}>
        <Menu />
    </DropdownMenu>;
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

