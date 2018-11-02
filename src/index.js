/**
 * App entry point.
 *
 * @module src/index
 */


import React from 'react';
import { render } from 'react-dom';

import User from 'src/User';
import App from 'src/App';

const appDiv = document.createElement('div');
appDiv.id = 'app';
document.body.appendChild(appDiv);

/**
 * Renders the app onto the page.
 *
 * @private
 */
function renderApp() {
    render(<App />, appDiv);
}

/**
 * Starts the app.
 *
 * @private
 */
async function start() {
    await User.refreshLoginStatus();
    renderApp();
}

start();

if (module.hot) {
    module.hot.accept('src/User', start);
    module.hot.accept('src/App', renderApp);

    module.hot.dispose(() => {
        document.body.removeChild(appDiv);
    });
}

