/**
 * Profile form.
 *
 * @module src/routes/signup/Profile
 */

import React from 'react';
import { bool, object, func } from 'prop-types';

import LikertScale from 'src/LikertScale';

import logoImage from 'public/images/logo-notext.svg';

/**
 * Maximum text field length.
 *
 * @private
 * @readonly
 * @type {number}
 */
// const TEXT_MAXLEN = 255;

/**
 * Maximum text area field length.
 *
 * @private
 * @readonly
 * @type {number}
 */
// const TEXTAREA_MAXLEN = 2047;

/**
 * Likert scale questions.
 *
 * @private
 * @readonly
 * @type {Object[]}
 */
const LIKERTS = [{
    title: 'I value...',
    questions: [{
        name: 'valuesFriendship',
        label: 'Friendship'
    }, {
        name: 'valuesFamily',
        label: 'Family'
    }, {
        name: 'valuesCommunity',
        label: 'Community'
    }, {
        name: 'valuesSelf',
        label: 'Self'
    }, {
        name: 'valuesFaith',
        label: 'Faith'
    }, {
        name: 'valuesEducation',
        label: 'Education'
    }, {
        name: 'valuesHealth',
        label: 'Health'
    }, {
        name: 'valuesStrength',
        label: 'Strength'
    }]
}];

/**
 * Profile form.
 *
 * @alias module:src/routes/signup/Profile
 *
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function SignupProfile(props) {
    const {
        disabled,
        onChange,
        likert
    } = props;

    /**
     * Handles a Likert scale input change.
     *
     * @param {string} name - The input's name.
     * @param {number} value - The new value.
     */
    function onLikertChange(name, value) {
        likert[name] = value;
        onChange('likert', likert);
    }

    const likertScales = LIKERTS.map(function(scaleProps, i) {
        return <LikertScale
            key={i}
            disabled={disabled}
            onChange={onLikertChange}
            values={likert}
            {...scaleProps}
        />;
    });

    return <form>
        <section>
            <img src={logoImage} />
            <div>
                <h4>Now, let&rsquo;s get personal.</h4>
                <h5>
                    To spark conversation between our bakers and you, tell
                    us a little about yourself below.
                </h5>
            </div>
        </section>
        {likertScales}
    </form>;
}

SignupProfile.propTypes = {
    disabled: bool,
    onChange: func.isRequired,
    likert: object.isRequired
};

export default SignupProfile;

