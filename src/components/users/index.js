const UsersMapper = require('./mapper/usersMapper');
const UsersService = require('./services/usersService');

class Users {

    constructor(Utils) {

        this.usersMapper = new UsersMapper(Utils);
        this.usersService = new UsersService({ ...Utils, UsersMapper: this.usersMapper });
    }
}

module.exports = Users;