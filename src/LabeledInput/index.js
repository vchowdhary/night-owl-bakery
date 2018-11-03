/**
 * Input with a corresponding label.
 *
 * @module src/LabeledInput
 */

import React from 'react';
import { string, bool } from 'prop-types';

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

    const req = rest.required
        ? <span className={styles.required} />
        : null;

    return <label className={styles.label}>
        {label}{req}
        <input placeholder={placeholder} {...rest} />
    </label>;
}

LabeledInput.propTypes = {
    label: string.isRequired,
    placeholder: string,
    required: bool
};

export default LabeledInput;

