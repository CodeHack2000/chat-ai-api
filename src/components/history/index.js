const HistoryService = require('./services/historyService');

class History {

    constructor(Utils) {

        this.historyService = new HistoryService(Utils);
    }
}

module.exports = History;