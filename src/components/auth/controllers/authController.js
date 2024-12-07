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

            req.logout((err) => {

                if (err) {
        
                    this.logger.error('<Auth> - Logout Error: ' + err);
                    return next(err);
                }
        
                req.session.destroy((err) => {
        
                    if (err) {
        
                        this.logger.error('<Auth> - Session Error: ' + err);
                        return next(err);
                    }
        
                    res.redirect('/');
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
     * Shows the home page of the authenticated user
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} rendered home page
     */
    async home(req, res) {

        this.logger.info('<Auth> - Start Home');

        res.json({ message: 'This route should be handled by Angular!' });
    };

    /**
     * Shows the login form
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} rendered login form
     */
    async login(req, res) {

        this.logger.info('<Auth> - Start Login');

        res.json({ message: 'This route should be handled by Angular!' });
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

        res
            .status(200)
            .json({  authenticated: true });
    }
}

module.exports = AuthController;