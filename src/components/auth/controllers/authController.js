const JsonWebTokenService = require('../services/jsonWebTokenService');

class AuthController {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;

        this.jsonWebTokenService = new JsonWebTokenService(Utils);
    }

    /**
     * Logs out the user and redirects to the root of the web application.
     * This function is to be used as an express.js route handler.
     * @param {Request} req express request
     * @param {Response} res express response
     * @param {NextFunction} next express next function
     * @throws {Error} Internal server error
     * @returns {Promise<Response>} redirect to the root of the web application
     */
    async logout(req, res, next) {

        try {

            this.logger.info('<Auth> - Start Logout');
            this.logger.debug('<Auth> - Entity: ' + req?.user?.id);
            
            const sessionID = req.sessionID;

            req.logout((err) => {

                if (err) {
        
                    this.logger.error('<Auth> - Logout Error: ' + err);
                    return next(err);
                }

                req.sessionStore.destroy(sessionID, (err) => {
                    if (err) {
                        this.logger.error('<Auth> - Store Destroy Error: ' + err);
                        return res.status(500).json({ message: 'Failed to destroy session' });
                    }
    
                    // Limpar o cookie de sessão no cliente
                    res.clearCookie('connect.sid', { path: '/' });
                    req.session = null;
    
                    this.logger.info('<Auth> - Logout Successful');
                    return res.status(200).json({ message: 'Logout successful' });
                });
            });
        }
        catch (error) {

            this.logger.error('<Auth> - Error: ' + error.message);
            res
                .status(500)
                .json('Internal server error');
        }
    };

    /**
     * Generates a JSON Web Token for internal use.
     * This function is to be used as an express.js route handler.
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} JSON Web Token for internal use
     */
    generateInternalToken(req, res) {

        this.logger.info('<Auth> - Start Generate Internal Token');

        const token = this.jsonWebTokenService.generateInternalToken(req.user);

        res
            .status(200)
            .json({ token });
    }

    /**
     * Verifies if the user is authenticated.
     * This function is to be used as an express.js route handler.
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} object with the property 'authenticated' set to true
     */
    isAuthenticated(req, res) {

        const sessionID = req.sessionID;
        console.log(sessionID);

        res
            .status(200)
            .json({  authenticated: true });
    }
}

module.exports = AuthController;