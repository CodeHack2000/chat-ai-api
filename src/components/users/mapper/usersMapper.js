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
            id: user?.id,
            name: this.commonMapper.toString( user?.name ),
            email: this.commonMapper.toString( user?.email ),
            password: this.commonMapper.toString( user?.password ),
            avatar: user?.image,
            googleId: this.commonMapper.toString( user?.googleId ),
            emailValidationState: this.commonMapper.toString( user?.emailValidationState ),
            updatedAt: Moment().toDate()
        };
    }

    /**
     * Maps a Google profile to a database model for inserting purposes
     * @param {Object} profile Google profile
     * @param {Buffer} imageBuffer image buffer of the user's avatar
     * @returns {Object} mapped user with inserted fields
     */
    insUserByGoogle(profile, imageBuffer) {
        return {
            googleId: this.commonMapper.toString( profile?.id ),
            name: this.commonMapper.toString( profile?.displayName ),
            email: this.commonMapper.toString( profile?.email ),
            avatar: imageBuffer,
            emailValidationState: 'notValidated',
            createdAt: Moment().toDate(),
            updatedAt: Moment().toDate()
        };
    }
}

module.exports = UsersMapper;