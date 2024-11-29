const Express = require('express');
const Passport = require('passport');

const UploadImage = require('@shared/middlewares/imageFormHandlingMiddleware');

const AuthPassController = require('../controllers/authPassController');

class AuthPassRoutes {

    constructor(Utils, DB) {

        this.router = Express.Router();
        
        this.controller = new AuthPassController(Utils, DB);

        this._registerRoute();
        this._confirmEmailRoute();
        this._loginRoute();
    }

    _registerRoute() {

        this.router.post(
            '/register', 
            UploadImage.single('avatar'),
            (req, res) => this.controller.register(req, res)
        );
    }

    _confirmEmailRoute() {

        this.router.get(
            '/confirm-email', 
            (req, res) => this.controller.emailConfirm(req, res)
        );
    }


    _loginRoute() {

        this.router.post(
            '/login',
            Passport.authenticate('local', { failureRedirect: '/' }),
            (req, res) => this.controller.login(req, res)
        );
    }
}

module.exports = AuthPassRoutes;