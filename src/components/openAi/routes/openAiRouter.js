const Express = require('express');

const OpenAiController = require('../controllers/openAiController');

class OpenAiRouter {

    constructor(Utils, External, Middlewares, DB) {

        const { AuthMiddleware } = Middlewares;

        this.authMiddleware = AuthMiddleware;
        this.router = Express.Router();

        this.controller = new OpenAiController(Utils, External, DB);

        this._sendMessageToModel();
    }

    _sendMessageToModel() {

        this.router.post(
            '/sendMessageToModel',
            (req, res, next) => this.authMiddleware.isLoggedIn(req, res, next),
            (req, res) => this.controller.sendMessageToModel(req, res)
        );
    }
}

module.exports = OpenAiRouter;