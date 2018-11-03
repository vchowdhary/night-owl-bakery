/**
 * User profile.
 *
 * @module src/User/Profile
 */

import React from 'react';
import { string } from 'prop-types';

import User from 'src/User';

import styles from './index.less';

/**
 * User profile.
 */
class Profile extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {};
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { id } = this.props;

        // TODO
        // TODO
        // TODO

        if (id !== User.id) {
            return <div className={styles.profile}>
                <h1>{id}</h1>
            </div>;
        }

        return <div className={styles.profile}>
            <h1>Hello, {id}!</h1>
        </div>;
    }
}

Profile.propTypes = {
    id: string.isRequired
};

export default Profile;

