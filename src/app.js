const Express = require('express');
const Session = require('express-session');
const Passport = require('passport');
const PostgresqlStore = require('connect-pg-simple')(Session);
const Cors = require('cors');

const serverConfig = require('@config/serverConfig');
const dbConfig = require('@config/dbConfig');

const UtilsComponent = require('@utils');
const OpenAiComponent = require('@openAi');
const ScrapingApiExternalComponent = require('@scrapingApiExternal');
const UsersComponent = require('@users');
const AuthPassComponent = require('@authPass');
const AuthGoogleComponent = require('@authGoogle');
const AuthComponent = require('@auth');
const HistoryComponent = require('@history');

const SharedMiddlewares = require('@shared/middlewares');

// Utils
const utils = new UtilsComponent();

// Utils pack
const _utils = {
    Logger: utils.logger,
    CommonMapper: utils.commonMapper
};

// Main auth
const auth = new AuthComponent({  Logger: utils.logger });

// DB
const usersData = new UsersComponent(_utils, { ImageFormHandlingMiddleware: SharedMiddlewares.imageFormHandlingMiddleware, AuthMiddleware: auth.middlewares });

// DB pack
const _db = {
    UsersService: usersData.usersService
};

// Auth
const authPass = new AuthPassComponent(_utils, _db, { SchemaValidationMiddleware: SharedMiddlewares.schemaValidationMiddleware });
const authGoogle = new AuthGoogleComponent({  Logger: utils.logger }, _db);

// Middlewares pack
const _middlewares = {
    AuthMiddleware: auth.middlewares,
    SchemaValidationMiddleware: SharedMiddlewares.schemaValidationMiddleware
};

// External
const scrapingApiExternal = new ScrapingApiExternalComponent({ Logger: utils.logger }, { AuthJsonWebTokenService: auth.authJsonWebTokenService });

// External pack
const _external = {
    ScrapingApiExternalService: scrapingApiExternal.scrapingApiExternalService
};

// Internal
const history = new HistoryComponent(_utils, _middlewares );
const openAi = new OpenAiComponent(_utils, _external, _middlewares, { HistoryService: history.historyService });

const app = Express();

const sessionStore = new PostgresqlStore({

    conString: `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`
});

// Add sessions to the application
app.use(Session({
    secret: serverConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    unset: 'destroy',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Config
app.disable('x-powered-by');

const corsConfig = {
    origin: `http://${serverConfig.frontEndHost}:${serverConfig.frontEndPort}`,
    method: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
};

// Middleware
app.use(Cors(corsConfig)); // Recomendado usar apenas nas rotas que quero tornar públicas
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(Passport.session());

// Middlewares
app.use(SharedMiddlewares.errorHandlerMiddleware);
app.use(auth.middlewares.handleSessionMessages);

// Routes
app.use('/', auth.router);
app.use('/auth/pass', authPass.router);
app.use('/auth/google', authGoogle.router);
app.use('/openAi', openAi.router);
app.use('/history', history.router);
app.use('/users', usersData.router);

module.exports = app;