const Express = require('express');

const OpenAiController = require('../controllers/openAiController');
const OpenAiRouterSchemas = require('../schemas/openAiRouterSchemas');

class OpenAiRouter {

    constructor(Utils, External, Middlewares, DB) {

        const { AuthMiddleware, SchemaValidationMiddleware } = Middlewares;

        this.authMiddleware = AuthMiddleware;
        this.schemaValidationMiddleware = SchemaValidationMiddleware;
        this.router = Express.Router();

        this.schemas = OpenAiRouterSchemas;
        this.controller = new OpenAiController(Utils, External, DB);

        this._sendMessageToModel();
    }

    _sendMessageToModel() {

        this.router.post(
            '/sendMessageToModel',
            [
                (req, res, next) => this.authMiddleware.isLoggedIn(req, res, next),
                (req, res, next) => this.schemaValidationMiddleware(this.schemas.sendMessageToModelSchema, 'body')(req, res, next)
            ],
            (req, res) => this.controller.sendMessageToModel(req, res)
        );
    }
}

module.exports = OpenAiRouter;