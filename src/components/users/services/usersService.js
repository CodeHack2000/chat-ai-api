const Moment = require('moment');

const UsersDB = require('../db/usersDB');
const UsersMapper = require('../mapper/usersMapper');

class UsersService {

    constructor(Utils) {

        const { Logger, CommonMapper } = Utils;

        this.logger = Logger;
        this.usersMapper = new UsersMapper(Utils);
        this.commonMapper = CommonMapper;
    }

    /**
     * Get a user by googleId
     * @param {Object} profile google user profile
     * @returns {Promise<Object>} user with the given googleId
     */
    async getUserByGoogleId(profile) {

        this.logger.info('<UsersService> - Getting user by google id');

        const mappedGoogleId = this.commonMapper.toString( profile?.id );

        return await UsersDB.getUserByGoogleId( mappedGoogleId );
    }

    /**
     * Inserts a new user in the database using a Google profile
     * @param {Object} profile google user profile
     * @param {Buffer} imageBuffer image buffer of the user's avatar
     * @returns {Promise<number>} id of the new user
     */
    async insGoogleUser(profile, imageBuffer) {

        this.logger.info('<UsersService> - Getting user by google id');

        const mappedUser = this.usersMapper.insUserByGoogle( profile, imageBuffer );

        return await UsersDB.insUser( mappedUser );
    }

    /**
     * Insert a new user in the database
     * @param {Object} user new user to insert
     * @returns {Promise<number>} id of the new user
     */
    async insUser( user ) {

        this.logger.info('<UsersService> - Inserting user');

        const mappedUser = this.usersMapper.insUser( user );

        return await UsersDB.insUser( mappedUser );
    }

    /**
     * Get a user by email
     * @param {string} email email of the user
     * @returns {Promise<Object>} user with the given email
     */
    async getUserByEmail( email ) {

        this.logger.info('<UsersService> - Getting user by email');

        const mappedEmail = this.commonMapper.toString( email );

        return await UsersDB.getUserByEmail( mappedEmail );
    }

    /**
     * Update a user
     * @param {Object} user user to update
     * @returns {Promise<boolean>} true if the user was updated, false otherwise
     */
    async updUser( user ) {

        this.logger.info('<UsersService> - Updating user');

        const mappedUser = this.usersMapper.updUser( user );

        return await UsersDB.updUser( mappedUser );
    }

    /**
     * Get all users that have not confirmed their email in the last 30 minutes
     * @returns {Promise<Array<Object>>} array of users that have not confirmed their email
     */
    async getNotConfirmedUsers() {

        this.logger.info('<UsersService> - Getting not confirmed users');

        const updatedAtDate = Moment().subtract(30, 'minutes').toDate();

        return await UsersDB.getNotConfirmedUsers( updatedAtDate );
    }

    /**
     * Get a user by id
     * @param {number} id id of the user
     * @returns {Promise<Object>} user with the given id
     */
    async getUserById(id) {

        this.logger.info('<UsersService> - Getting user by id');

        const mappedId = this.commonMapper.toString( id );

        return await UsersDB.getUserById( mappedId );
    }
}

module.exports = UsersService;