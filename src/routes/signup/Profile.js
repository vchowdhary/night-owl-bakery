/**
 * Profile form.
 *
 * @module src/routes/signup/Profile
 */

import React from 'react';
import { bool, string, func } from 'prop-types';

import LabeledInput from 'src/LabeledInput';

import logoImage from 'public/images/logo-notext.svg';

/**
 * Maximum text field length.
 *
 * @private
 * @readonly
 * @type {number}
 */
const TEXT_MAXLEN = 255;

/**
 * Maximum text area field length.
 *
 * @private
 * @readonly
 * @type {number}
 */
const TEXTAREA_MAXLEN = 2047;

/**
 * Form fields.
 *
 * @private
 * @readonly
 * @type {Object[]}
 */
const FIELDS = Object.freeze([{
    name: 'occupation',
    type: 'text',
    maxLength: TEXT_MAXLEN,
    label: 'My occupation is',
    placeholder: 'student'
}, {
    name: 'birthMonth',
    type: 'number',
    min: 1,
    max: 12,
    label: 'The month of my birth is',
    placeholder: '12'
}, {
    name: 'weekendActivity',
    type: 'text',
    maxLength: TEXT_MAXLEN,
    label: 'My favorite thing to do on the weekend is',
    placeholder: 'reading'
}, {
    name: 'favoriteFood',
    type: 'text',
    maxLength: TEXT_MAXLEN,
    label: 'I like to eat',
    placeholder: 'cookies'
}, {
    name: 'likeToWatch',
    type: 'text',
    maxLength: TEXT_MAXLEN,
    label: 'I like to watch',
    placeholder: 'Game of Thrones'
}, {
    name: 'pittsburghFavorite',
    type: 'text',
    maxLength: TEXT_MAXLEN,
    label: 'My favorite thing about Pittsburgh is',
    placeholder: 'the weather'
}, {
    name: 'origin',
    type: 'text',
    maxLength: TEXT_MAXLEN,
    label: 'I\'m from',
    placeholder: 'Pittsburgh'
}, {
    name: 'lifeMotto',
    type: 'text',
    maxLength: TEXT_MAXLEN,
    label: 'My life motto is',
    placeholder: 'my heart is in the work'
}]);

/**
 * Creates a change handler for the given key.
 *
 * @private
 * @param {Function} onChange - The handler to call.
 * @param {string} key - The key.
 * @returns {Function} The wrapped change handler.
 */
function handleChange(onChange, key) {
    return function(event) {
        onChange(key, event.target.value);
    };
}

/**
 * Profile form.
 *
 * @alias module:src/routes/signup/Profile
 *
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function SignupProfile(props) {
    const { disabled, onChange } = props;

    const inputs = FIELDS.map(function({ name, ...rest }) {
        return <LabeledInput
            key={name}
            disabled={disabled}
            onChange={handleChange(onChange, name)}
            {...rest}
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
        {inputs}
        <h4>Tell us more about yourself:</h4>
        <textarea
            maxLength={TEXTAREA_MAXLEN}
            onChange={handleChange(onChange, 'bio')}
        />
    </form>;
}

SignupProfile.propTypes = {
    disabled: bool,
    onChange: func.isRequired
};

FIELDS.forEach(function({ name }) {
    SignupProfile.propTypes[name] = string;
});

export default SignupProfile;

