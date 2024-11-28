const Express = require('express');

const UtilsComponent = require('@utils');
const OpenAiComponent = require('@openAi');
const ScrapingApiExternalComponent = require('@scrapingApiExternal');

const ErrorHandler = require('@shared/middlewares/errorHandlerMiddleware');

const app = Express();

// Utils
const utils = new UtilsComponent();

// Utils pack
const _utils = {
    Logger: utils.logger
};

// External
const scrapingApiExternal = new ScrapingApiExternalComponent(_utils);

// External pack
const _external = {
    ScrapingApiExternalService: scrapingApiExternal.scrapingApiExternalService
};

const openAi = new OpenAiComponent(_utils, _external);

// Config
app.disable('x-powered-by');

// Middleware
//app.use(Cors()); // Recomendado usar apenas nas rotas que quero tornar públicas
app.use(Express.json());

// Middlewares
// Error handler
app.use(ErrorHandler);

// Routes
app.get('/', (req, res) => {

    res.json('OK');
});

app.use('/openAi', openAi.router);

module.exports = app;