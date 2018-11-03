/**
 * Profile form.
 *
 * @module src/routes/signup/Profile
 */

import React from 'react';
import { bool } from 'prop-types';

import LabeledInput from 'src/LabeledInput';

import logoImage from 'public/images/logo-notext.svg';

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
    label: 'My occupation is',
    placeholder: 'baker'
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
    label: 'My favorite thing to do on the weekend is',
    placeholder: 'reading'
}, {
    name: 'favoriteFood',
    type: 'text',
    label: 'I like to eat',
    placeholder: 'cookies'
}, {
    name: 'likeToWatch',
    type: 'text',
    label: 'I like to watch',
    placeholder: 'Game of Thrones'
}, {
    name: 'pittsburghFavorite',
    type: 'text',
    label: 'My favorite thing about Pittsburgh is',
    placeholder: 'the weather'
}, {
    name: 'origin',
    type: 'text',
    label: 'I\'m from',
    placeholder: 'Pittsburgh'
}, {
    name: 'lifeMotto',
    type: 'text',
    label: 'My life motto is',
    placeholder: 'my heart is in the work'
}]);

/**
 * Profile form.
 *
 * @alias module:src/routes/signup/Profile
 */
class SignupProfile extends React.Component {
    /**
     * Initializes the component.
     *
     * @param {Object} props - The component's props.
     */
    constructor(props) {
        super(props);

        this.state = {};
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { disabled } = this.props;

        const inputs = FIELDS.map(({
            name, ...rest
        }) => {
            const onChange = event => {
                this.setState({ [name]: event.target.value });
            };

            return <LabeledInput
                key={name}
                disabled={disabled}
                onChange={onChange}
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
            <textarea onChange={event => {
                this.setState({ bio: event.target.value });
            }} />
        </form>;
    }
}

SignupProfile.propTypes = {
    disabled: bool
};

export default SignupProfile;

