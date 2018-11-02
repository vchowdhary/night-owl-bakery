/**
 * App entry point.
 *
 * @module src/index
 */


import React from 'react';
import { render } from 'react-dom';

import App from 'src/App';

const appDiv = document.createElement('div');
appDiv.id = 'app';
document.body.appendChild(appDiv);

/**
 * Starts the app by rendering it into the page.
 *
 * @private
 */
function start() {
    render(<App />, appDiv);
}

start();

if (module.hot) {
    module.hot.accept('src/App', start);

    module.hot.dispose(() => {
        document.body.removeChild(appDiv);
    });
}

