/**
 * Homepage.
 *
 * @module src/route
 */

import React from 'react';
import { hot } from 'react-hot-loader';

import ButtonLink from 'src/ButtonLink';

import styles from './index.less';

/**
 * Homepage.
 *
 * @returns {ReactElement} The component's elements.
 */
function Home() {
    return <div className={styles.home}>
        <section className={styles.logo} />
        <section className={styles.hero1}>
            <h1>
                We bake good into our com&shy;mu&shy;ni&shy;ty.
            </h1>
        </section>
        <article>
            <p>
                Night Owl Bakery is a new workforce development program for
                at-risk young adults who have yet to realize their full
                potential and self-worth.
            </p>
            <p>
                By offering experiences that combine food, entrepreneurship, and
                sustainability, participants learn vital skills for long-term
                economic independence.
            </p>
            <p>
                Ultimately, the program is designed to prepare participants for
                the future so they can experience a fuller sense of who they
                are, what they are a part of, and that they are capable of
                joining the workforce prepared.
            </p>
            <h3>
                One cookie, one connection.
            </h3>
            <h1 className={styles.cookieCounter}>
                2,314
            </h1>
            <p> cookies sold </p>
            <p>
                In order to effect meaningful social exchange and cultivate
                professional growth, we created an app to mediate between the
                bakers and hungry, community-oriented individuals like you. Join
                our movement below!
            </p>
            <ButtonLink key="signup" to="/signup/">
                Join Us
            </ButtonLink>
        </article>
        <section className={styles.hero2}>
            <h1>
                Our secret in&shy;gre&shy;di&shy;ent is com&shy;mu&shy;ni&shy;ty
                em&shy;pow&shy;er&shy;ment.
            </h1>
        </section>
    </div>;
}

export default hot(module)(Home);

