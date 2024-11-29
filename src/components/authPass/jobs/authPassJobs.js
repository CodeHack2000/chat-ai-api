const Cron = require('node-cron');

class AuthPassJobs {

    constructor(Utils, DB) {

        const { Logger } = Utils;
        const { UsersService } = DB;

        this.logger = Logger;
        this.usersService = UsersService;

        this._validateNonConfirmedEmailsJob();
    }

    _validateNonConfirmedEmailsJob() {

        Cron.schedule('*/5 * * * *', async () => {

            try {
        
                this.logger.info('<AuthPassJob> - Start Validate Non Confirmed Emails Job');
        
                const nonConfirmedUsers = await this.usersService.getNotConfirmedUsers();
        
                for (const user of nonConfirmedUsers) {
        
                    this.logger.debug('<AuthPassJob> - User not confirmed: ' + user.id);
        
                    // Remove the password and change the validation state
                    user.password = null;
                    user.emailValidationState = 'notValidated';
                    await this.usersService.updUser(user.dataValues);
                }
            }
            catch (error) {
        
                this.logger.error('<AuthPassJob> - Error: ' + error.message);
            }
        });
    }
}

module.exports = AuthPassJobs;