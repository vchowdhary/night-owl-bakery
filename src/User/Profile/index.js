/**
 * User profile.
 *
 * @module src/User/Profile
 */

import React from 'react';
import { string, node } from 'prop-types';

import XHRpromise from 'src/XHRpromise';
import Spinner from 'src/Spinner';
import User from 'src/User';

import styles from './index.less';

/**
 * Calendar months.
 *
 * @private
 * @readonly
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
 * Profile attributes.
 *
 * @private
 * @readonly
 * @enum {Object}
 */
const ATTRS = Object.freeze({
    occupation: {
        desc: 'Occupation'
    },
    birthMonth: {
        desc: 'Birth month'
    },
    weekendActivity: {
        desc: 'Favorite weekend activity'
    },
    favoriteFood: {
        desc: 'Favorite food'
    },
    likeToWatch: {
        desc: 'Likes to watch'
    },
    pittsburghFavorite: {
        desc: 'Favorite thing about Pittsburgh'
    },
    origin: {
        desc: 'From'
    },
    lifeMotto: {
        desc: 'Life motto'
    }
});

/**
 * Profile attribute.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.desc - Description of the attribute.
 * @param {ReactNode} props.children - The value to display.
 * @returns {ReactElement} The component's elements.
 */
function ProfileAttr(props) {
    const { desc, children } = props;
    return <li>{desc}: {children}</li>;
}

ProfileAttr.propTypes = {
    desc: string,
    children: node
};

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
            profile: null,
            matchIDs: null
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
            if ('birthMonth' in profile) {
                profile.birthMonth = MONTHS[profile.birthMonth - 1];
            }
            this.setState({ profile });
        } catch (error) {
            this.setState({ error });
        } finally {
            this.setState({ loading: false });
        }
    }

    /**
     * Refreshes match IDs.
     *
     * @returns {void} Resolves when the refresh has completed.
     */
    async refreshMatchIDs() {
        const { id } = this.props;
        const { profile } = this.state;

        if (User.id !== id || !profile || profile.isEmployee) {
            // Cannot have matches if not logged in or is an employee.
            this.setState({ matchIDs: null });
            return;
        }

        this.setState({ loading: true });

        try {
            const { response } = await XHRpromise('GET', '/api/match', {
                successStatus: 200
            });

            const matchIDs = JSON.parse(response);
            this.setState({ matchIDs });
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
        await this.refreshMatchIDs();
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
        await this.refreshMatchIDs();
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { loading, error, profile, matchIDs } = this.state;
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
            bio,
            ...profileAttrs
        } = profile;

        const attrs = Object.keys(ATTRS).map(function(key) {
            const attr = profileAttrs[key];
            if (!attr) {
                return;
            }

            return <ProfileAttr key={key} {...ATTRS[key]}>
                {attr}
            </ProfileAttr>;
        });

        const matches = matchIDs
            ? matchIDs.map(id => {
                return <li key={id}>
                    <Profile key={id} id={id} />
                </li>;
            })
            : null;

        return <div className={styles.profile}>
            <h2 className={styles.title}>
                {nameFirst} {nameLast} {isEmployee ? '(Employee)' : ''}
            </h2>
            <ul>{attrs}</ul>
            {bio && <h3>About me</h3>}
            {bio && <p className={styles.bio}>{bio}</p>}
            {matches && <h3>Matches</h3>}
            {matches && <ol className={styles.matches}>{matches}</ol>}
        </div>;
    }
}

Profile.propTypes = {
    id: string.isRequired
};

export default Profile;

