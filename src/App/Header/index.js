/**
 * App header.
 *
 * @module src/App/Header
 */

import React from 'react';
import { NavLink } from 'react-router-dom';

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
        <h1 className={styles.text}>Night Owl Bakery</h1>
    </NavLink>;
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
        <section className={styles.start}>
            <Logo />
        </section>
        <section className={styles.center}>
        </section>
        <section className={styles.end}>
        </section>
    </header>;
}

export default Header;

