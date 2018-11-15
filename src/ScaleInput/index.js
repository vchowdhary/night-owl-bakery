/**
 * Scale-based input component.
 *
 * @module src/ScaleInput
 */

import React from 'react';
import {
    bool, number, string, func, arrayOf, shape, object, node
} from 'prop-types';
import classNames from 'classnames';

import styles from './index.less';

/**
 * Scale input row component.
 *
 * @private
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function ScaleInputRow(props) {
    const {
        name,
        value,
        valueMin,
        valueMax,
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

    const cols = new Array(valueMax - valueMin + 1);
    for (let i = 0; i < valueMax; i++) {
        const radioValue = valueMin + i;
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

ScaleInputRow.propTypes = {
    name: string.isRequired,
    value: number,
    valueMin: number.isRequired,
    valueMax: number.isRequired,
    disabled: bool,
    label: string.isRequired,
    onChange: func
};

/**
 * Scale-based input component.
 *
 * @alias module:src/ScaleInput
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function ScaleInput(props) {
    const {
        title,
        questions,
        scale,
        values,
        disabled,
        onChange
    } = props;

    const valueMin = 1;
    const valueMax = scale.length - 1;

    const questionRows = questions.map(function(rowProps) {
        const { name, label } = rowProps;

        return <ScaleInputRow
            key={name}
            name={name}
            value={values[name]}
            valueMin={valueMin}
            valueMax={valueMax}
            disabled={disabled}
            label={label}
            onChange={onChange}
        />;
    });

    const scaleCols = new Array(valueMax - valueMin - 1);
    for (let i = valueMin; i <= valueMax; i++) {
        scaleCols[i] = <th key={i} className={styles.text}>
            {scale[i]}
        </th>;
    }

    return <div className={styles.likertScale}>
        <table>
            <thead>
                <tr>
                    <th className={styles.text}>{title}</th>
                    {scaleCols}
                </tr>
            </thead>
            <tbody>
                {questionRows}
            </tbody>
        </table>
    </div>;
}

ScaleInput.propTypes = {
    title: node,
    questions: arrayOf(shape({
        name: string.isRequired,
        label: string.isRequired
    })).isRequired,
    scale: arrayOf(string).isRequired,
    values: object.isRequired,
    disabled: bool,
    onChange: func
};

export default ScaleInput;

