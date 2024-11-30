const ScrapingApiExternalService = require('./services/scrapingApiExternalService');

class ScrapingApiExternal {

    constructor(Utils, Tools) {

        this.scrapingApiExternalService = new ScrapingApiExternalService(Utils, Tools);
    }
}

module.exports = ScrapingApiExternal;