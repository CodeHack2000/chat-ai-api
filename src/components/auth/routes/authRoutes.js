const Express = require('express');

const AuthMiddleware = require('../middlewares/authMiddleware');
const AuthController = require('../controllers/authController');

class AuthRoutes {

    constructor(Utils) {

        this.router = Express.Router();
        this.controller = new AuthController(Utils);

        this._loginRoute();
        this._homeRoute();
        this._logoutRoute();
    }

    _loginRoute() {

        this.router.get(
            '/',
            (req, res) => this.controller.login(req, res)
        );
    }

    _homeRoute() {

        this.router.get(
            '/home',
            (req, res, next) => AuthMiddleware.isLoggedIn(req, res, next),
            (req, res) => this.controller.home(req, res)
        );
    }

    _logoutRoute() {

        this.router.post(
            '/logout',
            (req, res, next) => this.controller.logout(req, res, next)
        );
    }
}

module.exports = AuthRoutes;