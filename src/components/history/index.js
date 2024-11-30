const HistortyRouter = require('./routes/historyRouter');
const HistoryService = require('./services/historyService');

class History {

    constructor(Utils, Middlewares) {

        this.historyService = new HistoryService(Utils);
        this.router = (new HistortyRouter(Utils, Middlewares, { HistoryService: this.historyService })).router;
    }
}

module.exports = History;