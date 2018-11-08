/**
 * Match querying.
 *
 * @module MatchQuery
 */

'use strict';

const Router = require('express-promise-router');
const levenshtein = require('js-levenshtein');

const isAuthenticated = require('./isAuthenticated');

/**
 * Calculates the match score for an employer and employee.
 *
 * A higher score is better.
 *
 * @param {module:Users#Profile} employer - The employer profile.
 * @param {module:Users#Profile} employee - The employee profile.
 * @returns {number} The score.
 */
function matchScore(employer, employee) {
    const birthMonth = (employer.birthMonth === employee.birthMonth)
        ? 0.01
        : 0;

    return [
        'weekendActivity',
        'favoriteFood',
        'likeToWatch',
        'pittsburghFavorite'
    ].reduce(function(score, key) {
        if (!(key in employer) || !(key in employee)) {
            return score;
        }

        const a = employer[key];
        const b = employee[key];
        const diff = 1 - (levenshtein(a, b) / Math.max(a.length, b.length));

        return score + diff;
    }, birthMonth);
}

/**
 * Represents a match query.
 *
 * @alias module:MatchQuery
 */
class MatchQuery {
    /**
     * Creates a new query.
     *
     * @param {module:Users} users - The user map.
     * @param {module:Users#Profile} employer - The query's employer profile.
     */
    constructor(users, employer) {
        Object.defineProperties(this, /** @lends module:MatchQuery# */ {
            /**
             * The user map.
             *
             * @readonly
             * @type {module:Users}
             */
            users: { value: users },

            /**
             * The employer.
             *
             * @readonly
             * @type {module:Users#Profile}
             */
            employer: { value: employer },

            /**
             * The matched employee IDs, or `null` if not yet matched.
             *
             * @readonly
             * @type {string[]?}
             */
            employeeIDs: { value: null, writable: true }
        });
    }

    /**
     * Runs the query.
     *
     * @param {number} [limit] - Maximum number of employees to match.
     * @returns {module:MatchQuery} Resolves with the query on success, or
     * rejects with an error.
     */
    async run(limit) {
        const { users, employer } = this;

        const employees = await users.Profile.findAll({
            attributes: [
                'id',
                'birthMonth',
                'weekendActivity',
                'favoriteFood',
                'likeToWatch',
                'pittsburghFavorite'
            ],
            where: {
                isEmployee: true
            }
        });

        if (limit === void 0) {
            limit = employees.length;
        }

        // Score each employee.
        employees.forEach(function(employee) {
            employee.score = matchScore(employer, employee);
        });

        // Sort in descending score order.
        employees.sort(function(a, b) {
            return b.score - a.score;
        });

        // Save top result IDs.
        const employeeIDs = new Array(limit);
        for (let i = 0; i < limit; i++) {
            employeeIDs[i] = employees[i].id;
        }

        this.employeeIDs = employeeIDs;
        return this;
    }

    /**
     * Creates a new router for match querying.
     *
     * @param {module:Users} users - The user map.
     * @returns {express~Router} The router.
     */
    static router(users) {
        const router = Router();

        router.get(
            '/',
            isAuthenticated,
            async function(req, res) {
                let limit;

                if ('limit' in req.query) {
                    limit = Number.parseInt(req.query.limit, 10);
                    if (Number.isNaN(limit)) {
                        res.set('Content-Type', 'text/plain')
                            .status(400)
                            .end();
                    }
                }

                const { user } = req;
                const employer = await user.getProfile();

                const match = new MatchQuery(users, employer);
                await match.run(limit);

                res.json(match.employeeIDs).end();
            }
        );

        return router;
    }
}

Object.freeze(MatchQuery);

module.exports = MatchQuery;

