/**
 * User profile.
 *
 * @module src/User/Profile
 */

import React from 'react';
import { string } from 'prop-types';
import { Redirect } from 'react-router-dom';

import XHRpromise from 'src/XHRpromise';
import Spinner from 'src/Spinner';

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
            return <Redirect to="/404/" />;
        }

        return <div className={styles.profile}>
            <h1>{profile.nameFirst} {profile.nameLast}</h1>
        </div>;
    }
}

Profile.propTypes = {
    id: string.isRequired
};

export default Profile;

