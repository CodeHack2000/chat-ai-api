const Express = require('express');
const Passport = require('passport');

const AuthGoogleController = require('../controllers/authGoogleController');

class AuthGoogleRouter {

    constructor(Utils) {

        this.router = Express.Router();
        this.controller = new AuthGoogleController(Utils);

        this._defaultRoute();
        this._callbackRoute();
        this._failureRoute();
    }

    _defaultRoute() {

        this.router.get(
            '/',
            Passport.authenticate('google', { scope: [ 'email', 'profile' ] })
        );
    }

    _callbackRoute() {

        this.router.get(
            '/callback',
            // Verifies that the entity is authenticated with google
            Passport.authenticate('google', {

                // If the entity is successfully authenticated
                successRedirect: '/home',
        
                // If the entity fails in authenticate
                failureRedirect: '/auth/google/failure'
            })
        );
    }

    _failureRoute() {

        this.router.get(
            '/failure',
            (req, res) => this.controller.authFailure(req, res)
        );
    }
}

module.exports = AuthGoogleRouter;