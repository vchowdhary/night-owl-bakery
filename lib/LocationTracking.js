/**
 * Location tracking API tools
 * @module LocationTracking
 */

 'use strict'
const Users = require('./Users');
const Router = require('express-promise-router');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const isAuthenticated = require('./isAuthenticated');

/**
 * Handles location tracking
 * @alias module:LocationTracking
 */
class LocationTracking {
    /**
     * Creates new LocationController
     * 
     * @param {Sequelize} sequelize - The Sequelize instance
     */
    constructor(sequelize) {
        const Geolocation = sequelize.define(
            'Geolocation',
            /**@lends module:Location */{
                latitude:
                {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                longitude:
                {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                userID:
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    primaryKey: true
                }
            }
        )

        //Users.belongsTo(Geolocation);
        //Geolocation.hasMany(Users);

        Object.defineProperties(this, /** @lends module:LocationTracking# */ {
            /**
             * The Sequelize instance.
             *
             * @private
             * @readonly
             * @type {Sequelize}
             */
            sequelize: { value: sequelize },
            Geolocation: { value: Geolocation }
        });
    }

    /**
     * Inserts into database
     * @param {string} latitude - latitude to be inserted
     * @param {string} longitude - same as above
     * @param {string} userID - the associated user id
     * @return {module:Geolocation} Returns created location
     */
    async insert(latitude, longitude, userID){
        console.log('Attempting insert...');
        console.log(userID);
        try {
            return await this.sequelize.transaction(async(transaction) => {
                const location = await this.Geolocation.findOrCreate({where: {userID: userID
                    }, defaults: {latitude: latitude, longitude: longitude}})
                    .spread((location, created) => {
                        console.log(created);
                        if (!created) {
                            location.updateAttributes({latitude: latitude, longitude: longitude});
                        }
                        console.log(location.latitude);
                        console.log(location.longitude);
                    });
            });
        } catch (err) {
            console.log('This didnt work');
            console.log(err);
            if (err instanceof Sequelize.UniqueConstraintError) {
                throw new Error(`Location of user with id"${userID}" already exists.`);
            }

            if (err instanceof Sequelize.ValidationError) {
                throw new Error(err.errors.reduce(
                    function(str, error) {
                        return `${str}\n${error.message}`;
                    },
                    'Validation failed:'
                ));
            }
            throw err;
        }
    }

    async getLocation(userID)
    {
        try
        {
            return await this.sequelize.transaction(async(transaction) => {
                const location = await this.Geolocation.findOne({where: {userID: userID}});
                return location;
            });

        } catch (err){
            console.log('This didnt work');
            console.log(err);
            if (err instanceof Sequelize.UniqueConstraintError) {
                throw new Error(`Location of user with id"${userID}" already exists.`);
            }

            if (err instanceof Sequelize.ValidationError) {
                throw new Error(err.errors.reduce(
                    function(str, error) {
                        return `${str}\n${error.message}`;
                    },
                    'Validation failed:'
                ));
            }
            throw err;
        }
    }

    /**
     * Creates a new router for the locations.
     *
     * @returns {express~Router} The router.
     */
    router() {
        // Router for a single location.
        const locationRouter = Router();

        // Attempts to create a new location.
        locationRouter.put(
            '/',
            bodyParser.json(),
            async(req, res) => {
                //const { id } = req;

                try {
                    //console.log('put try');
                    const {
                        latitude,
                        longitude,
                        userID
                    } = req.body;
                    //console.log(req.body);

                    if (!latitude || !longitude) {
                        throw new Error('Missing request data.');
                    }

                    console.log('Attempting to insert');
                    console.log(userID);
                    await this.insert(
                        latitude,
                        longitude,
                        userID
                    );
                    console.log('Inserted successfully');

                    const ulocation = req.originalUrl;
                    res.set('Location', ulocation);
                    res.set('Content-Type', 'text/plain')
                        .status(201)
                        .end();

                } catch (err) {
                    // Creation failed; report error.
                    console.log('Error occurred');
                    console.log(err);
                    res.set('Content-Type', 'text/plain')
                        .status(400)
                        .send(err.message)
                        .end();
                }
            }
        );

        // Gets information about the specified location.
        locationRouter.get(
            '/',
            bodyParser.json(),
            async(req, res) => {
                try {
                    console.log('get try');

                    /*const {
                        latitude,
                        longitude,
                        userID
                    } = req.body;*/

                    var userID = req.query.userID;

                    console.log(req.query.userID);
                    //console.log(latitude);
                    //console.log(longitude);

                    if (!userID) {
                        throw new Error('Missing request data.');
                    }

                    const location = await this.getLocation(
                        userID
                    );
                    console.log('Found successfully');

                    console.log('Fetched this...');
                    //console.log(location);

                    res.status(201);
                    res.json(location).end();
                    //res.set('Location', ulocation);
                    /*res.set('Content-Type', 'application/json')
                        .status(201)
                        .end();*/

                } catch (err) {
                    // Creation failed; report error.
                    console.log('Error occurred');
                    console.log(err);
                    res.set('Content-Type', 'text/plain')
                        .status(400)
                        .send(err.message)
                        .end();
                }
            }
            
        )

        return locationRouter;
    }

}

Object.freeze(LocationTracking);
module.exports = LocationTracking;