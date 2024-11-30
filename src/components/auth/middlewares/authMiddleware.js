class AuthMiddleware {

    /**
     * Checks if the request is authenticated with a valid user.
     * If so, calls next(), otherwise sends a 401 Unauthorized response.
     * @param {Request} req express request
     * @param {Response} res express response
     * @param {NextFunction} next express next function
     * @returns {undefined}
     */
    static isLoggedIn(req, res, next) {

        req.user?.profiles?.includes('USER') ? next() : res.sendStatus(401);
    }

    /**
     * Checks if the request is authenticated with a user having an 'ADM' profile.
     * If so, calls next(), otherwise sends a 401 Unauthorized response.
     * @param {Request} req express request
     * @param {Response} res express response
     * @param {NextFunction} next express next function
     * @returns {undefined}
     */
    static isLoggedInAdmin(req, res, next) {

        req.user?.profiles?.includes('ADM') ? next() : res.sendStatus(401);
    }

    /**
     * Checks if the request is authenticated with a user having a 'VIP' profile.
     * If so, calls next(), otherwise sends a 401 Unauthorized response.
     * @param {Request} req express request
     * @param {Response} res express response
     * @param {NextFunction} next express next function
     * @returns {undefined}
     */
    static isLoggedInVip(req, res, next) {

        req.user?.profiles?.includes('VIP') ? next() : res.sendStatus(401);
    }

    /**
     * Handles session messages by transferring them to the response locals.
     * This function is to be used as an Express.js middleware.
     * 
     * @param {Request} req Express request
     * @param {Response} res Express response
     * @param {NextFunction} next Express next function
     * @returns {undefined}
     */
    static handleSessionMessages(req, res, next) {

        const msgs = req?.session?.messags || [];
        res.locals.messages = msgs;
        res.locals.hasMessages = !! msgs?.length;
        req.session.messages = [];
        next();
    }
}

module.exports = AuthMiddleware;