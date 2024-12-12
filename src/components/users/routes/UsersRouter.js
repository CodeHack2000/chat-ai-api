const Express = require('express');

const UsersController = require('../controllers/UsersController');

class UsersRouter {

    constructor(Utils, DB, Middlewares) {

        const { AuthMiddleware, ImageFormHandlingMiddleware } = Middlewares;

        this.router = Express.Router();
        this.controller = new UsersController(Utils, DB);
        this.authMiddleware = AuthMiddleware;
        this.imageFormHandlingMiddleware = ImageFormHandlingMiddleware;

        this._updateUserImage();
    }

    _updateUserImage() {

        this.router.put(
            '/updateUserImage',
            [
                (req, res, next) => this.authMiddleware.isLoggedIn(req, res, next),
                (req, res, next) => this.imageFormHandlingMiddleware(req, res, next)
            ],
            (req, res) => this.controller.updateUserImage(req, res)
        );
    }
}

module.exports = UsersRouter;