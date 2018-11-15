/**
 * Profile form.
 *
 * @module src/routes/signup/Profile
 */

import React from 'react';
import { bool, object, func } from 'prop-types';

import ScaleInput, { Group as ScaleInputGroup } from 'src/ScaleInput';

import logoImage from 'public/images/logo-notext.svg';

/**
 * Likert scale questions.
 *
 * @private
 * @readonly
 * @type {Object[]}
 */
const LIKERTS = [{
    title: <h4>What are your most important values?</h4>,
    scale: [
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
    title: 'Dogs or cats?',
    name: 'dogCat',
    min: 'Dogs',
    max: 'Cats'
}, {
    title: 'Donuts or munchkins?',
    name: 'donutMunchkins',
    min: 'Donuts',
    max: 'Munchkins'
}, {
    title: 'Cake or pie?',
    name: 'cakePie',
    min: 'Cake',
    max: 'Pie'
}, {
    title: 'Steelers or Pirates?',
    name: 'steelersPirates',
    min: 'Steelers',
    max: 'Pirates'
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

    const likertScales = LIKERTS.map(function(scaleProps, i) {
        return <ScaleInputGroup
            key={i}
            disabled={disabled}
            onChange={onLikertChange}
            values={likert}
            {...scaleProps}
        />;
    });


    const semDiffScales = SEMDIFF.map(function(scaleProps) {
        const { title, name, min, max, ...rest } = scaleProps;
        const scale = [
            min,
            '← Slightly',
            'Neither',
            'Slightly →',
            max
        ];

        return <ScaleInput
            key={name}
            title={<h4>{title}</h4>}
            name={name}
            value={semDiff[name]}
            scale={scale}
            disabled={disabled}
            onChange={onSemDiffChange}
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
        {likertScales}
        <h4>For these questions, pick what you like more.</h4>
        {semDiffScales}
    </form>;
}

SignupProfile.propTypes = {
    disabled: bool,
    onChange: func.isRequired,
    likert: object.isRequired,
    semDiff: object.isRequired
};

export default SignupProfile;

