class AuthGoogleController {

    constructor(Logger) {

        this.logger = Logger;
    }

    /**
     * Handles the failure of the authentication process with Google OAuth2.
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} response with the result of the operation
     */
    async authFailure(req, res) {

        this.logger.info('<GoogleAuth> - Auth Failure');
    
        res.send('Something goes wrong');
    };
};

module.exports = AuthGoogleController;