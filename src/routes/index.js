/**
 * Homepage.
 *
 * @module src/route
 */

import React from 'react';
import { hot } from 'react-hot-loader';

import styles from './index.less';

/**
 * Homepage.
 *
 * @returns {ReactElement} The component's elements.
 */
function Home() {
    return <div className={styles.home}>
        <section className={styles.hero}>
            <div className={styles.logo} />
        </section>
        <section>
            <h1>Welcome to the Bakery!</h1>
            <p>
                Established in 2019, the Night Owl Bakery is In autem ut fugit
                et omnis ut animi quia. Non facilis pariatur fugiat eaque. Sit
                nihil quia aut ipsum non eum magni deserunt.
            </p>
        </section>
        <section>
            <h2>Who are the Bakers?</h2>
            <p>
                Vel rerum incidunt ut molestias at quia iure. Commodi
                exercitationem harum repellat sit. Labore dolor voluptatem qui
                neque velit dolores vero deserunt. Ex veniam eius maiores.
                Deserunt pariatur sit harum ea saepe qui et.
            </p>
            <p>
                Id quas possimus nihil ut sed rem numquam. Dignissimos enim ex
                cupiditate vel minima. Nesciunt harum quos ex. Dolore sit
                accusamus eos laudantium nam placeat.  In voluptas cum illum
                sequi et dicta.
            </p>
        </section>
    </div>;
}

export default hot(module)(Home);

