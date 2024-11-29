const UsersService = require('./services/usersService');

class Users {

    constructor(Utils) {

        this.usersService = new UsersService(Utils);
    }
}

module.exports = Users;