const Express = require('express');
const HistoryController = require('../controller/historyController');

class HistoryRouter {

    constructor(Utils, Middlewares, DB) {

        const { AuthMiddleware } = Middlewares;

        this.router = Express.Router();
        this.authMiddleware = AuthMiddleware;

        this.controller = new HistoryController(Utils, DB);

        this._getUserHistory();
    }

    _getUserHistory() {

        this.router.get(
            '/getUserHistory',
            (req, res, next) => this.authMiddleware.isLoggedInVip(req, res, next),
            (req, res) => this.controller.getUserHistory(req, res)
        );
    }
}

module.exports = HistoryRouter;