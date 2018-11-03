/**
 * Input with a corresponding label.
 *
 * @module src/LabeledInput
 */

import React from 'react';
import { string } from 'prop-types';

import styles from './index.less';

/**
 * Input with label.
 *
 * @private
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function LabeledInput(props) {
    const { label, placeholder = label, ...rest } = props;

    return <label className={styles.label}>
        <span className={styles.label}>{label}</span>
        <input placeholder={placeholder} {...rest} />
    </label>;
}

LabeledInput.propTypes = {
    label: string.isRequired,
    placeholder: string
};

export default LabeledInput;

