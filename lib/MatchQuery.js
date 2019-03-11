/**
 * Match querying.
 *
 * @module MatchQuery
 */

'use strict';

const Router = require('express-promise-router');
const levenshtein = require('js-levenshtein');

const isAuthenticated = require('./isAuthenticated');
let { PythonShell } = require('python-shell');

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
    // TODO broken
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
    }, 0);
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
                'likert',
                'semDiff'
            ],
            where: {
                isEmployee: true
            }
        });

        if (limit === void 0) {
            limit = employees.length;
        }

        console.log('running python script');
        var spawn = require('child_process').spawn;
        var py    = await spawn('python', ['/Users/vanshikachowdhary/Documents/GitHub/night-owl-bakery/tools/get_matches.py']),
            data = [employer, employees],
            dataString = '';

        py.stdin.write(JSON.stringify(data));
        py.stdin.end();
        py.stdout.on('data', function(data){
            dataString += data.toString();
        });
        return new Promise(function(resolve, reject){
            py.stdout.on('end', function(){
                var result = JSON.parse(dataString);
                //console.log(result);
                //console.log(Object.keys(result.id_x).length);
                limit = Math.min(limit, Object.keys(result.id_x).length);
                //console.log(limit);
                var employeeID2s = new Array(limit);
                for(var i = 1; i <= limit; i++)
                {
                    employeeID2s[i - 1] = result['id_y']['' + Object.keys(result.id_x).length - i];
                }
                //console.log(employeeIDs);
                //this.employeeIDs = employeeIDs;
                resolve(employeeID2s);
            });
        }, 5000);
        
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
                //console.log(user);
                const employer = await user.getProfile();

                const match = new MatchQuery(users, employer);
                await match.run(limit).then(function(v)
                {
                    match.employeeIDs = v;
                });
                //console.log(match.employeeIDs);
                res.json(match.employeeIDs).end();
            }
        );

        return router;
    }
}

Object.freeze(MatchQuery);

module.exports = MatchQuery;

