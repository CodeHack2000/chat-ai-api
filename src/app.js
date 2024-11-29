const Express = require('express');
const Session = require('express-session');
const Passport = require('passport');
const PostgresqlStore = require('connect-pg-simple')(Session);
const Path = require('path');

const serverConfig = require('@config/serverConfig');
const dbConfig = require('@config/dbConfig');

const UtilsComponent = require('@utils');
const OpenAiComponent = require('@openAi');
const ScrapingApiExternalComponent = require('@scrapingApiExternal');
const UsersComponent = require('@users');
const AuthPassComponent = require('@authPass');
const AuthGoogleComponent = require('@authGoogle');
const AuthComponent = require('@auth');

const ErrorHandler = require('@shared/middlewares/errorHandlerMiddleware');

// Utils
const utils = new UtilsComponent();

// Utils pack
const _utils = {
    Logger: utils.logger,
    CommonMapper: utils.commonMapper
};

// DB
const usersData = new UsersComponent(_utils);

// DB pack
const _db = {
    UsersService: usersData.usersService
};

// External
const scrapingApiExternal = new ScrapingApiExternalComponent({ Logger: utils.logger });

// External pack
const _external = {
    ScrapingApiExternalService: scrapingApiExternal.scrapingApiExternalService
};

// Internal
const openAi = new OpenAiComponent({ Logger: utils.logger }, _external);
const authPass = new AuthPassComponent(_utils, _db);
const authGoogle = new AuthGoogleComponent({  Logger: utils.logger }, _db);
const auth = new AuthComponent({  Logger: utils.logger });

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
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Config
app.disable('x-powered-by');

// Middleware
//app.use(Cors()); // Recomendado usar apenas nas rotas que quero tornar públicas
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.set('views', Path.join(__dirname, './components/shared/views'));
app.set('view engine', 'ejs');
app.use(Passport.session());

// Middlewares
app.use(ErrorHandler);
app.use(auth.handleSessionMessagesMiddleware);

// Routes
app.use('/', auth.router);
app.use('/auth/pass', authPass.router);
app.use('/auth/google', authGoogle.router);
app.use('/openAi', openAi.router);

module.exports = app;