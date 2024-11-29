const Moment = require('moment');

class UsersMapper {

    constructor(Utils) {

        const { CommonMapper } = Utils;

        this.commonMapper = CommonMapper;
    }

    /**
     * Maps an user to a database model
     * @param {Object} user user to map
     * @returns {Object} mapped user
     */
    insUser(user) {

        return {
            name: this.commonMapper.toString( user?.name ),
            email: this.commonMapper.toString( user?.email ),
            password: this.commonMapper.toString( user?.password ),
            avatar: user?.image,
            googleId: this.commonMapper.toString( user?.googleId ),
            emailValidationState: this.commonMapper.toString( user?.emailValidationState ),
            createdAt: Moment().toDate(),
            updatedAt: Moment().toDate()
        };
    };

    /**
     * Maps a user object to a database model for updating purposes
     * @param {Object} user user to update
     * @returns {Object} mapped user with updated fields
     */
    updUser(user) {

        return {
            id: this.commonMapper.toString( user?.id ),
            name: this.commonMapper.toString( user?.name ),
            email: this.commonMapper.toString( user?.email ),
            password: this.commonMapper.toString( user?.password ),
            avatar: user?.image,
            googleId: this.commonMapper.toString( user?.googleId ),
            emailValidationState: this.commonMapper.toString( user?.emailValidationState ),
            createdAt: Moment().toDate(),
            updatedAt: Moment().toDate()
        };
    }

    /**
     * Maps a google profile to a user object that can be inserted in the database
     * @param {Object} profile google profile
     * @returns {Object} mapped user
     */
    insUserByGoogle(profile) {
        return {
            googleId: this.commonMapper.toString( profile?.id ),
            name: this.commonMapper.toString( profile?.displayName ),
            email: this.commonMapper.toString( profile?.email ),
            avatar: this.commonMapper.toString( profile?.picture ),
            emailValidationState: 'notValidated',
            createdAt: Moment().toDate(),
            updatedAt: Moment().toDate()
        };
    }
}

module.exports = UsersMapper;