/**
 * Profile form.
 *
 * @module src/routes/signup/Profile
 */

import React from 'react';
import { bool, object, func } from 'prop-types';

import { Group as ScaleInputGroup } from 'src/ScaleInput';

import logoImage from 'public/images/logo-notext.svg';

/**
 * Maximum text area length, in bytes.
 *
 * @private
 * @readonly
 * @type {number}
 */
const TEXTAREA_MAXLEN = 2047;

/**
 * Likert scale questions.
 *
 * @private
 * @readonly
 * @type {Object[]}
 */
const LIKERTS = [{
    title: 'What are your most important values?',
    scale: ['1', '2', '3', '4', '5'],
    legend: [
        'Least important',
        '',
        'Somewhat important',
        '',
        'Most important'
    ],
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
 * Semantic differential scale questions.
 *
 * @private
 * @readonly
 * @type {Object[]}
 */
const SEMDIFF = [{
    name: 'dogCat',
    label: 'Dogs or cats?',
    min: 'Dogs',
    max: 'Cats'
}, {
    name: 'donutMunchkins',
    label: 'Donuts or munchkins?',
    min: 'Donuts',
    max: 'Munchkins'
}, {
    name: 'cakePie',
    label: 'Cake or pie?',
    min: 'Cake',
    max: 'Pie'
}, {
    name: 'steelersPirates',
    label: 'Steelers or Pirates?',
    min: 'Steelers',
    max: 'Pirates'
}].map(function(config) {
    const { min, max, ...rest } = config;
    rest.scale = [
        min,
        '← Slightly',
        'Neither',
        'Slightly →',
        max
    ];

    return rest;
});

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
        likert,
        semDiff
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

    /**
     * Handles a semantic differential scale input change.
     *
     * @param {string} name - The input's name.
     * @param {number} value - The new value.
     */
    function onSemDiffChange(name, value) {
        semDiff[name] = value;
        onChange('semDiff', semDiff);
    }

    const likertScales = LIKERTS.map(function(config, i) {
        const { title, ...rest } = config;

        return [
            <h4 key='title'>{title}</h4>,
            <ScaleInputGroup
                key={i}
                disabled={disabled}
                onChange={onLikertChange}
                values={likert}
                {...rest}
            />
        ];
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
        <h4>For these questions, pick what you like more.</h4>
        <ScaleInputGroup
            questions={SEMDIFF}
            disabled={disabled}
            onChange={onSemDiffChange}
            values={semDiff}
        />
        <h4>Tell us more about yourself:</h4>
        <textarea
            maxLength={TEXTAREA_MAXLEN}
            placeholder="Anything else to share?"
            onChange={function(event) {
                onChange('bio', event.target.value);
            }}
        />
    </form>;
}

SignupProfile.propTypes = {
    disabled: bool,
    onChange: func.isRequired,
    likert: object.isRequired,
    semDiff: object.isRequired
};

export default SignupProfile;

