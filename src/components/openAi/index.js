const OpenAiRouter = require('./routes/openAiRouter');

class OpenAi {

    constructor(Utils, External, Middlewares) {

        this.router = (new OpenAiRouter(Utils, External, Middlewares)).router;
    }
}

module.exports = OpenAi;