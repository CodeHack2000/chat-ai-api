class AuthController {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
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

        res.render('home', { name: req?.user?.name });
    };

    /**
     * Shows the login form
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} rendered login form
     */
    async login(req, res) {

        this.logger.info('<Auth> - Start Login');

        res.render('login');
    };
}

module.exports = AuthController;