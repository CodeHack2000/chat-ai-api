const { Op } = require('sequelize');

const { users } = require('@models');

class UsersDB {
    
    /**
     * Get a user by googleId
     * @param {string} id googleId of the user
     * @returns {Promise<Object>} user with the given googleId
     */
    static async getUserByGoogleId(id) {

        return await users.findOne({ where: { googleId: id } });
    }

    /**
     * Insert a new user in the database
     * @param {Object} user new user to insert
     * @returns {Promise<uuid>} id of the new user
     */
    static async insUser(user) {

        const createUser = await users.create(user);

        return createUser.id;
    }

    /**
     * Get a user by email
     * @param {string} email email of the user
     * @returns {Promise<Object>} user with the given email
     */
    static async getUserByEmail(email) {

        return await users.findOne({ where: { email: email } });
    }

    /**
     * Update a user
     * @param {Object} user user to update
     * @returns {Promise<boolean>} true if the user was updated, false otherwise
     */
    static async updUser(user) {

        const affectedRows = await users.update(

            user,
            {
                where: {
                    id: user.id
                }
            }
        );

        return !!affectedRows?.[0];
    }

    /**
     * Get all users that have not confirmed their email in the last 30 minutes
     * @returns {Promise<Array<Object>>} array of users that have not confirmed their email
     */
    static async getNotConfirmedUsers(updatedAtDate) {

        return await users.findAll({

            where: {
                emailValidationState: 'inValidation',
                updatedAt: {
                    [Op.lt]: updatedAtDate
                }
            }
        });
    }

    /**
     * Get a user by id
     * @param {uuid} id id of the user
     * @returns {Promise<Object>} user with the given id
     */
    static async getUserById(id) {

        return await users.findByPk(id);
    }
}

module.exports = UsersDB;