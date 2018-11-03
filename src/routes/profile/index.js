/**
 * User profile page.
 *
 * @module src/routes/profile
 */

import React from 'react';
import { shape, string } from 'prop-types';
import { hot } from 'react-hot-loader';
import { Switch, Route, Redirect } from 'react-router-dom';

import User from 'src/User';
import Profile from 'src/User/Profile';

/**
 * User profile page.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.match - The router match.
 * @param {string} props.match.url - The matched URL.
 * @returns {ReactElement} The component's elements.
 */
function ProfilePage(props) {
    const { url } = props.match;

    return <Switch>
        <Redirect
            from={`${url}:id`}
            exact={true}
            strict={true}
            to={`${url}:id/`}
        />
        <Route
            path={`${url}:id/`}
            strict={true}
            render={function({ match }) {
                const id = decodeURIComponent(match.params.id);
                return <Profile id={id} />;
            }}
        />
        {
            User.loggedIn
                ? <Redirect to={`${url}${encodeURIComponent(User.id)}/`} />
                : <Redirect to="/login" />
        }
    </Switch>;
}

ProfilePage.propTypes = {
    match: shape({
        url: string.isRequired
    }).isRequired
};

export default hot(module)(ProfilePage);

