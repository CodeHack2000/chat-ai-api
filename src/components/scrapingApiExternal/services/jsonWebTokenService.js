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
}

module.exports = JsonWebTokenService;