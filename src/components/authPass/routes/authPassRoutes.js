const Express = require('express');
const Passport = require('passport');

const AuthPassRouterSchemas = require('../schemas/authPassRouterSchemas');
const AuthPassController = require('../controllers/authPassController');

class AuthPassRoutes {

    constructor(Utils, DB, Middlewares) {

        const { ImageFormHandlingMiddleware, SchemaValidationMiddleware } = Middlewares;

        this.schemaValidationMiddleware = SchemaValidationMiddleware;
        this.imageFormHandlingMiddleware = ImageFormHandlingMiddleware;
        this.router = Express.Router();
        
        this.schemas = AuthPassRouterSchemas;
        this.controller = new AuthPassController(Utils, DB);

        this._registerRoute();
        this._confirmEmailRoute();
        this._loginRoute();
    }

    _registerRoute() {

        this.router.post(
            '/register', 
            [
                this.imageFormHandlingMiddleware.single('avatar'),
                (req, res, next) => this.schemaValidationMiddleware(this.schemas.register, 'body')(req, res, next)
            ],
            (req, res) => this.controller.register(req, res)
        );
    }

    _confirmEmailRoute() {

        this.router.get(
            '/confirm-email',
            (req, res, next) => this.schemaValidationMiddleware(this.schemas.emailConfirm, 'query')(req, res, next),
            (req, res) => this.controller.emailConfirm(req, res)
        );
    }


    _loginRoute() {

        this.router.post(
            '/login',
            [
                (req, res, next) => this.schemaValidationMiddleware(this.schemas.login, 'body')(req, res, next),
                Passport.authenticate('local')
            ],
            (req, res) => this.controller.login(req, res)
        );
    }
}

module.exports = AuthPassRoutes;