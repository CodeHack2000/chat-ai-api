const Express = require('express');

const OpenAiController = require('../controllers/openAiController');

class OpenAiRouter {

    constructor(Utils, External) {

        this.router = Express.Router();

        this.controller = new OpenAiController(Utils, External);

        this._sendMessageToModel();
    }

    _sendMessageToModel() {

        this.router.post(
            '/sendMessageToModel',
            (req, res) => this.controller.sendMessageToModel(req, res)
        );
    }
}

module.exports = OpenAiRouter;