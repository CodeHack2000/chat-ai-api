const OpenAiRouter = require('./routes/openAiRouter');

class OpenAi {

    constructor(Utils, External) {

        this.router = (new OpenAiRouter(Utils, External)).router;
    }
}

module.exports = OpenAi;