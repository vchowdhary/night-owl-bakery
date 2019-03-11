/**
 * Homepage.
 *
 * @module src/route
 */

import React from 'react';
import { hot } from 'react-hot-loader';
import Octicon, { Plus } from '@githubprimer/octicons-react';
import User from 'src/User';
import XHRpromise from 'src/XHRpromise';

const API = '/api/match/';

//import ButtonLink from 'src/ButtonLink';
//import Counter from 'src/Counter';

//import styles from './index.less';

/**
 * Homepage.
 *
 * @returns {ReactElement} The component's elements.
 */
class MatchPage extends React.Component {
    /**
     * Initializes the component.
     *
     * @param {Object} props - The component's props.
     */
    constructor(props)
    {
        super(props);
        const { id } = User;
        this.id = id;
        [
            'getMatch'
        ].forEach(key => {
            this[key] = this[key].bind(this);
        });
    }
    
    /**
     * testing
     * @private
     */
    async getMatch()
    {
        //console.log('clicked');
        //console.log(this.id);

        const { status, responseText } = await XHRpromise('GET', API + '?limit=' + 5);

        switch (status) {
            case 200:
            case 201:
            case 204:
                break;
            case 401:
                throw new Error('Incorrect.');
            default:
                throw new Error('Unknown error occurred.');
        }
        var responseJSON = JSON.parse(responseText);
        console.log(responseJSON);
        //console.log('responseText');
        
    }
    
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render(){
        return <div>
            <h1> Make a Request </h1>
            <button
                type="submit"
                disabled= {false}
                onClick = {this.getMatch}
            >
                <Octicon icon={Plus} />
                &nbsp; Submit
            </button>
        </div>;
    }
}

export default hot(module)(MatchPage);