/**
 * User profile.
 *
 * @module src/User/Profile
 */

import React from 'react';
import { string } from 'prop-types';

import XHRpromise from 'src/XHRpromise';
import Spinner from 'src/Spinner';
import Delete from 'src/User/Delete';

import styles from './index.less';

/**
 * Calendar months.
 *
 * @type {string[]}
 */
const MONTHS = Object.freeze([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]);

/**
 * User profile.
 */
class Profile extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            loading: true,
            error: null,
            profile: null
        };
    }

    /**
     * Refreshes the current profile.
     *
     * @returns {void} Resolves when the refresh has completed.
     */
    async refreshProfile() {
        const { id } = this.props;
        const reqURL = `/api/users/${encodeURIComponent(id)}`;

        this.setState({ loading: true });

        try {
            const { response } = await XHRpromise('GET', reqURL, {
                successStatus: 200
            });

            const profile = JSON.parse(response);
            this.setState({ profile });
        } catch (error) {
            this.setState({ error });
        } finally {
            this.setState({ loading: false });
        }
    }

    /**
     * React lifecycle handler called when component has mounted.
     */
    async componentDidMount() {
        if (!this.state.loading) {
            return;
        }

        await this.refreshProfile();
    }

    /**
     * React lifecycle handler called when component has updated.
     *
     * @param {Object} prevProps - The component's previous props.
     */
    async componentDidUpdate(prevProps) {
        if (this.props.id === prevProps.id) {
            return;     // Profile has not changed.
        }

        await this.refreshProfile();
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { loading, error, profile } = this.state;
        if (loading) {
            return <Spinner />;
        }

        if (error) {
            return <div>
                <h1>404 - Not Found</h1>
                <p>The user &quot;{this.props.id}&quot; does not exist.</p>
            </div>;
        }

        const {
            nameFirst,
            nameLast,
            isEmployee,
            occupation,
            birthMonth,
            weekendActivity,
            favoriteFood,
            likeToWatch,
            pittsburghFavorite,
            origin,
            lifeMotto,
            bio
        } = profile;

        return <div className={styles.profile}>
            <h1>{nameFirst} {nameLast} {isEmployee ? '(Employee)' : ''}</h1>
            <ul>
                <li>Occupation: {occupation}</li>
                <li>Birth month: {MONTHS[birthMonth - 1]}</li>
                <li>Favorite weekend activity: {weekendActivity}</li>
                <li>Favorite food: {favoriteFood}</li>
                <li>Likes to watch: {likeToWatch}</li>
                <li>Favorite thing about Pittsburgh: {pittsburghFavorite}</li>
                <li>From: {origin}</li>
                <li>Life motto: &quot;{lifeMotto}&quot;</li>
            </ul>
            <h3>About me</h3>
            <p className={styles.bio}>{bio}</p>
            <div className={styles.danger}>
                <Delete className={styles.delete} />
            </div>
        </div>;
    }
}

Profile.propTypes = {
    id: string.isRequired
};

export default Profile;

