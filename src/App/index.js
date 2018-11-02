/**
 * App root component.
 *
 * @module src/App
 */

import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';

import Header from 'src/Header';

import styles from './index.less';

/**
 * App root component.
 *
 * @alias module:src/App
 *
 * @returns {ReactElement} The component's elements.
 */
function App() {
    return <BrowserRouter basename={__webpack_public_path__}>
        <div className={styles.app}>
            <Header />
            <main>
            </main>
        </div>
    </BrowserRouter>;
}

export default hot(module)(App);

