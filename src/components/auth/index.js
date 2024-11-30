const AuthRouter = require('./routes/authRoutes');
const AuthMiddleware = require('./middlewares/authMiddleware');
const JsonWebTokenService = require('./services/jsonWebTokenService');

class Auth {

    constructor(Utils) {

        this.middlewares = AuthMiddleware;
        this.authJsonWebTokenService = new JsonWebTokenService(Utils);
        this.router = (new AuthRouter(Utils, { JsonWebTokenService: this.authJsonWebTokenService }, { AuthMiddleware: this.middlewares })).router;
    }
}

module.exports = Auth;