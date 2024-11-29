const OpenAiRouter = require('./routes/openAiRouter');

class OpenAi {

    constructor(Utils, External, Middlewares, DB) {

        this.router = (new OpenAiRouter(Utils, External, Middlewares, DB)).router;
    }
}

module.exports = OpenAi;