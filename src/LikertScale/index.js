/**
 * Likert scale component.
 *
 * @module src/LikertScale
 */

import React from 'react';
import {
    bool, number, string, func, arrayOf, shape, object, node
} from 'prop-types';
import classNames from 'classnames';

import styles from './index.less';

/**
 * Conversion from Likert scale values to names.
 *
 * @private
 * @readonly
 * @type {string[]}
 */
const LIKERT_SCALE = [
    'N/A',
    'Strongly disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly agree'
];

/**
 * Minimum possible Likert scale score.
 *
 * @private
 * @readonly
 * @type {number}
 */
const LIKERT_MIN = 1;

/**
 * Maximum possible Likert scale score.
 *
 * @private
 * @readonly
 * @type {number}
 */
const LIKERT_MAX = LIKERT_SCALE.length - 1;

/**
 * Converts a Likert scale value into a name.
 *
 * @private
 * @param {number} value - The value to convert.
 * @returns {string} The name.
 */
function toLikertName(value) {
    return LIKERT_SCALE[value] || LIKERT_SCALE[0];
}

/**
 * Likert scale row component.
 *
 * @private
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function LikertScaleRow(props) {
    const {
        name,
        value,
        disabled,
        label,
        onChange
    } = props;

    let onRadioChange;
    if (onChange) {
        onRadioChange = function(event) {
            const radioValue = Number.parseInt(event.target.value, 10);
            onChange(name, radioValue);
        };
    }

    const cols = new Array(LIKERT_MAX);
    for (let i = 0; i < LIKERT_MAX; i++) {
        const radioValue = LIKERT_MIN + i;
        const checked = (radioValue === value);

        cols[i] = <td key={radioValue}>
            <label className={classNames({
                [styles.checked]: checked
            })}>
                <input
                    type="radio"
                    name={name}
                    value={radioValue}
                    disabled={disabled}
                    checked={checked}
                    onChange={onRadioChange}
                />
            </label>
        </td>;
    }

    return <tr>
        <td className={styles.text}>{label}</td>
        {cols}
    </tr>;
}

LikertScaleRow.propTypes = {
    name: string.isRequired,
    value: number,
    disabled: bool,
    label: string.isRequired,
    onChange: func
};

/**
 * Likert scale.
 *
 * @alias module:src/LikertScale
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function LikertScale(props) {
    const {
        title,
        questions,
        values,
        disabled,
        onChange
    } = props;

    const rows = questions.map(function(likertProps) {
        const { name } = likertProps;

        return <LikertScaleRow
            key={name}
            disabled={disabled}
            value={values[name]}
            onChange={onChange}
            {...likertProps}
        />;
    });

    const scale = new Array(LIKERT_MAX);
    for (let i = 0; i < LIKERT_MAX; i++) {
        const scaleValue = LIKERT_MIN + i;
        scale[i] = <th key={scaleValue} className={styles.text}>
            {toLikertName(scaleValue)}
        </th>;
    }

    return <div className={styles.likertScale}>
        <table>
            <thead>
                <tr>
                    <th className={styles.text}>{title}</th>
                    {scale}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    </div>;
}

LikertScale.propTypes = {
    title: node,
    questions: arrayOf(
        shape(LikertScaleRow.propTypes)
    ).isRequired,
    values: object.isRequired,
    disabled: bool,
    onChange: func
};

export default LikertScale;

