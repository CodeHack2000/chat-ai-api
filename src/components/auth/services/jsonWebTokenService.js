const JWT = require('jsonwebtoken');

const config = require('../config/config');

class JsonWebTokenService {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Generates a JSON Web Token for internal API authentication.
     * 
     * @returns {string} JSON Web Token with a 2-minute expiration time,
     *                   containing the issuer and audience information.
     */
    generateInternalApiToken() {

        this.logger.info('<JsonWebTokenService> - Start Generate Internal Api Token');

        return JWT.sign({
            iss: config.host,
            aud: config.scrapingApiHost
        }, config.internalApiSecret, { expiresIn: '2m' } );
    }

    /**
     * Generates a JSON Web Token for internal use.
     * 
     * @param {Object} user - The user object to create the token for.
     * @returns {string} JSON Web Token with a 30-minute expiration time,
     *                   containing the issuer and audience information.
     */
    generateInternalToken(user) {

        this.logger.info('<JsonWebTokenService> - Start Generate Internal Token for user ' + user.id);

        return JWT.sign({
            iss: config.host,
            aud: config.scrapingApiHost,
            sub: user.id
        }, config.internalSecret, { expiresIn: '30m' } );
    }
}

module.exports = JsonWebTokenService;