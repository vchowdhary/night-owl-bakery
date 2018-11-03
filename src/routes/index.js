/**
 * Homepage.
 *
 * @module src/route
 */

import React from 'react';

import styles from './index.less';
import logoImage from 'public/images/logo.svg';

/**
 * Homepage.
 *
 * @returns {ReactElement} The component's elements.
 */
function Home() {
    return <div className={styles.home}>
        <img className={styles.logo} src={logoImage} />
    </div>;
}

export default Home;

