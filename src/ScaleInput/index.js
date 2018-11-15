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
        scale,
        showScale,
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

    const cols = scale.map(function(scaleName, i) {
        const radioValue = i + 1;
        const checked = (radioValue === value);
        const text = showScale && <span className={styles.text}>
            {scaleName}
        </span>;

        return <td key={radioValue}>
            <label className={classNames({
                [styles.checked]: checked
            })}>
                {text}
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
    });

    return <tr>
        {label && <td className={styles.text}>{label}</td>}
        {cols}
    </tr>;
}

ScaleInputRow.propTypes = {
    name: string.isRequired,
    value: number,
    scale: arrayOf(string),
    showScale: bool,
    disabled: bool,
    label: node,
    onChange: func
};

/**
 * Scale-based input group component.
 *
 * @alias module:src/ScaleInput.Group
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function ScaleInputGroup(props) {
    const {
        title,
        questions,
        scale,
        values,
        disabled,
        onChange
    } = props;

    const questionRows = questions.map(function(rowProps) {
        const { name, label } = rowProps;

        return <ScaleInputRow
            key={name}
            name={name}
            value={values[name]}
            scale={scale}
            disabled={disabled}
            label={label}
            onChange={onChange}
        />;
    });

    const scaleCols = scale.map(function(scaleName, i) {
        return <th key={i} className={styles.text}>
            {scaleName}
        </th>;
    });

    return <div className={styles.scaleInput}>
        {title}
        <table>
            <thead>
                <tr>
                    <th />
                    {scaleCols}
                </tr>
            </thead>
            <tbody>
                {questionRows}
            </tbody>
        </table>
    </div>;
}

ScaleInputGroup.propTypes = {
    title: node,
    questions: arrayOf(shape({
        name: string.isRequired,
        label: node
    })).isRequired,
    scale: arrayOf(string).isRequired,
    values: object.isRequired,
    disabled: bool,
    onChange: func
};

/**
 * Scale input component.
 *
 * @private
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function ScaleInput(props) {
    const { title } = props;

    return <div className={styles.scaleInput}>
        { title }
        <table>
            <tbody>
                <ScaleInputRow
                    showScale={true}
                    {...props}
                />
            </tbody>
        </table>
    </div>;
}

ScaleInput.propTypes = {
    title: node,
    name: string.isRequired,
    value: number,
    scale: arrayOf(string).isRequired,
    disabled: bool,
    label: node,
    onChange: func
};

export { ScaleInputGroup as Group };

export default ScaleInput;

