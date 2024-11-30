const AuthPassRouter = require('./routes/authPassRoutes');
const AuthPassJobs = require('./jobs/authPassJobs');
const AuthPassStrategy = require('./middlewares/authPassStrategyMiddleware');

class AuthPass {

    constructor(Utils, DB, Middlewares) {

        this.router = (new AuthPassRouter(Utils, DB, Middlewares)).router;
        this.jobs = new AuthPassJobs(Utils, DB);
        this.strategy = new AuthPassStrategy(Utils, DB);
    }
}

module.exports = AuthPass;