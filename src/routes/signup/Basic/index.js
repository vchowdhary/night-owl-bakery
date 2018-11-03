/**
 * Basic information form.
 *
 * @module src/routes/signup/Basic
 */

import React from 'react';
import { bool } from 'prop-types';

import LabeledInput from 'src/LabeledInput';

import logoImage from 'public/images/logo-notext.svg';
import styles from './index.less';

/**
 * Maximum text field length.
 *
 * @private
 * @readonly
 * @type {number}
 */
const TEXT_MAXLEN = 255;

/**
 * Basic information form.
 *
 * @alias module:src/routes/signup/Basic
 */
class SignupBasic extends React.Component {
    /**
     * Initializes the component.
     *
     * @param {Object} props - The component's props.
     */
    constructor(props) {
        super(props);

        this.state = {
            nameFirst: '',
            nameLast: '',
            phone: '',
            zipCode: ''
        };

        [
            'onNameFirstChange',
            'onNameLastChange',
            'onPhoneChange',
            'onZipCodeChange'
        ].forEach(key => {
            this[key] = this[key].bind(this);
        });
    }

    /**
     * Handles first name change.
     *
     * @private
     * @param {Event} event - The event.
     */
    onNameFirstChange(event) {
        this.setState({ nameFirst: event.target.value });
    }

    /**
     * Handles last name change.
     *
     * @private
     * @param {Event} event - The event.
     */
    onNameLastChange(event) {
        this.setState({ nameLast: event.target.value });
    }

    /**
     * Handles phone number change.
     *
     * @private
     * @param {Event} event - The event.
     */
    onPhoneChange(event) {
        this.setState({ phone: event.target.value });
    }

    /**
     * Handles ZIP code change.
     *
     * @private
     * @param {Event} event - The event.
     */
    onZipCodeChange(event) {
        this.setState({ zipCode: event.target.value });
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const {
            onNameFirstChange,
            onNameLastChange,
            onPhoneChange,
            onZipCodeChange
        } = this;

        const { disabled } = this.props;

        const {
            nameFirst,
            nameLast,
            phone,
            zipCode
        } = this.state;

        return <form className={styles.basic}>
            <div className={styles.header}>
                <img src={logoImage} />
                <div>
                    <h4>Let&rsquo;s get started.</h4>
                    <h5>
                        First, we&rsquo;ll need some basic profile information.
                    </h5>
                </div>
            </div>
            <div role="group">
                <LabeledInput
                    type="text"
                    label="First name"
                    maxLength={TEXT_MAXLEN}
                    required={true}
                    disabled={disabled}
                    value={nameFirst}
                    onChange={onNameFirstChange}
                />
                <LabeledInput
                    type="text"
                    label="Last name"
                    maxLength={TEXT_MAXLEN}
                    required={true}
                    disabled={disabled}
                    value={nameLast}
                    onChange={onNameLastChange}
                />
            </div>
            <div role="group">
                <LabeledInput
                    type="tel"
                    label="Phone #"
                    maxLength={TEXT_MAXLEN}
                    disabled={disabled}
                    value={phone}
                    onChange={onPhoneChange}
                />
                <LabeledInput
                    type="text"
                    label="ZIP code"
                    maxLength={TEXT_MAXLEN}
                    disabled={disabled}
                    value={zipCode}
                    onChange={onZipCodeChange}
                />
            </div>
        </form>;
    }
}

SignupBasic.propTypes = {
    disabled: bool
};

export default SignupBasic;

