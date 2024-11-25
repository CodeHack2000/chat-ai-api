const ScrapingApiExternalService = require('./services/scrapingApiExternalService');

class ScrapingApiExternal {

    constructor(Utils) {

        this.scrapingApiExternalService = new ScrapingApiExternalService(Utils);
    }
}

module.exports = ScrapingApiExternal;