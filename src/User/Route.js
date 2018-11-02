/**
 * Route for user authentication.
 *
 * @module src/User/Route
 */

import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { func } from 'prop-types';

import User from '.';

/**
 * Represents a route that needs a user to be authenticated.
 *
 * @alias module:src/User/Route
 *
 * @private
 * @param {Object} props - The properties for the route.
 * @returns {ReactElement} The component's elements.
 */
function UserRoute(props) {
    const { component: Component, ...rest } = props;

    return <Route {...rest} render={componentProps => {
        if (!User.loggedIn) {
            const redirect = {
                pathname: User.paths.login,
                state: { referer: componentProps.location }
            };
            return <Redirect to={redirect} />;
        }

        return <Component {...componentProps} />;
    }} />;
}

UserRoute.propTypes = {
    component: func.isRequired
};

export default UserRoute;

