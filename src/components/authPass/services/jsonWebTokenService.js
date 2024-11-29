const JWT = require('jsonwebtoken');

const authPassConfig = require('../config/authPassConfig');

class JsonWebTokenService {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Generate a JSON Web Token to confirm the entity email
     * @param {string} email email of the entity to confirm
     * @returns {string} JSON Web Token to confirm the entity
     */
    generateConfirmationToken(email) {

        this.logger.info('JsonWebToken - Start Generate Confirmation Token');

        return JWT.sign({ email}, authPassConfig.brevoJwtSecret, { expiresIn: '30m' } );
    }

    /**
     * Verify a JSON Web Token to confirm the entity email
     * @param {string} token JSON Web Token to verify
     * @returns {Object} payload of the token, or throw an exception if the token is invalid
     */
    verifyConfirmationToken(token) {

        this.logger.info('JsonWebToken - Start Verify Confirmation Token');

        return JWT.verify(token, authPassConfig.brevoJwtSecret);
    }
}

module.exports = JsonWebTokenService;