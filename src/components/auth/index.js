const AuthRouter = require('./routes/authRoutes');
const AuthMiddleware = require('./middlewares/authMiddleware');

class Auth {

    constructor(Utils) {

        this.router = (new AuthRouter(Utils)).router;
        this.middlewares = AuthMiddleware;
    }
}

module.exports = Auth;