/**
 * Button link component.
 *
 * @module src/ButtonLink
 */

import React from 'react';
import { shape, func, string, node } from 'prop-types';
import { withRouter } from 'react-router-dom';

/**
 * Button link component.
 *
 * @alias module:src/ButtonLink
 *
 * @param {Object} props - The component's props.
 * @param {string} props.to - Link destination.
 * @param {Object} props.history - Router history.
 * @param {string} [props.className] - Button class.
 * @param {ReactNode} [props.children] - Link contents.
 * @returns {ReactElement} The component's elements.
 */
function ButtonLink(props) {
    const { to, history, className, children } = props;

    return <button className={className} onClick={() => {
        history.push(to);
    }}>
        {children}
    </button>;
}

ButtonLink.propTypes = {
    to: string.isRequired,
    history: shape({
        push: func.isRequired
    }).isRequired,
    className: string,
    children: node
};

export default withRouter(ButtonLink);

