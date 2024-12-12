const UsersRouter = require('./routes/UsersRouter');
const UsersService = require('./services/usersService');

class Users {

    constructor(Utils, Middlewares) {

        this.usersService = new UsersService(Utils);
        this.router = (new UsersRouter(Utils, { UsersService: this.usersService }, Middlewares)).router;
    }
}

module.exports = Users;