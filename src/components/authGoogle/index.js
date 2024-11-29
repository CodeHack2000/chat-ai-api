const AuthGoogleRouter = require('./routes/authGoogleRoutes');
const AuthGoogleStrategy = require('./middlewares/authGoogleStrategyMiddleware');

class AuthGoogle {

    constructor(Utils, DB) {

        this.router = (new AuthGoogleRouter(Utils)).router;
        this.strategy = new AuthGoogleStrategy(Utils, DB);
    }
}

module.exports = AuthGoogle;