/**
 * App root component.
 *
 * @module src/App
 */

import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import asyncComponent from 'src/async-component';
import Spinner from 'src/Spinner';
import User from 'src/User';

import AsyncNotFound from 'bundle-loader?lazy!./NotFound';
import AsyncLogin from 'bundle-loader?lazy!./Login';
import Header from './Header';

import styles from './index.less';

const Login = asyncComponent(AsyncLogin, Spinner);
const NotFound = asyncComponent(AsyncNotFound, Spinner);

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
                <Switch>
                    <Route path={User.paths.login} component={Login} />
                    <Route component={NotFound} />
                </Switch>
            </main>
        </div>
    </BrowserRouter>;
}

export default hot(module)(App);

