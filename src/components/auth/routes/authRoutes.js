const Express = require('express');

const AuthController = require('../controllers/authController');

class AuthRoutes {

    constructor(Utils, Tools, Middlwares) {

        const { AuthMiddleware } = Middlwares;

        this.router = Express.Router();
        this.controller = new AuthController(Utils, Tools);
        this.authMiddleware = AuthMiddleware;

        this._generateInternalToken();
        this._logoutRoute();
        this._isAuthenticated();
    }

    _generateInternalToken() {

        this.router.get(
            '/auth/generateInternalToken',
            (req, res, next) => this.authMiddleware.isLoggedInAdmin(req, res, next),
            (req, res) => this.controller.generateInternalToken(req, res)
        );
    }

    _logoutRoute() {

        this.router.post(
            '/logout',
            (req, res, next) => this.authMiddleware.isLoggedIn(req, res, next),
            (req, res, next) => this.controller.logout(req, res, next)
        );
    }

    _isAuthenticated() {

        this.router.get(
            '/isAuthenticated',
            (req, res, next) => this.authMiddleware.isLoggedIn(req, res, next),
            (req, res) => this.controller.isAuthenticated(req, res)
        );
    }
}

module.exports = AuthRoutes;