const Passport = require('passport');
const { Strategy } = require('passport-local');

const AuthPassHashingService = require('../services/authPassHashingService');

class AuthPassStrategyMiddleware {

    constructor(Utils, DB) {

        const { Logger } = Utils;
        const { UsersService } = DB;

        this.logger = Logger;
        this.usersService = UsersService;
        this.authPassHashingService = new AuthPassHashingService(Utils);

        this._configStrategy();
    }

    _configStrategy() {

        Passport.use(new Strategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    
            try {
        
                this.logger.info('<PassAuthMiddleware> - Start Login');
        
                // Find the user by the email
                const user = await this.usersService.getUserByEmail(email);
        
                // If the user was not found
                if (!user?.id) {
        
                    this.logger.warn('<PassAuthMiddleware> - User not found');
                    return done(null, false, 'User not found');
                }
                    
                // Compare the password with the stored hash
                const isMatch = await this.authPassHashingService.verifyPassword(user?.password, password);
                
                // If the passwords don't match
                if (!isMatch) {
                    
                    this.logger.warn('<PassAuthMiddleware> - Incorrect password');
                    return done(null, false, { message: 'Incorrect password' });
                }
        
                if (user?.emailValidationState !== 'validated') {
                    
                    this.logger.warn('<PassAuthMiddleware> - User not validated');
                    return done(null, false, { message: 'User not validated' });
                }
        
                this.logger.info('<PassAuthMiddleware> - User logged in');
                this.logger.debug('<PassAuthMiddleware> - User: ' + user?.id);
        
                return done(null, {
                    id: user.id,
                    name: user.name,
                    profiles: user.profiles,
                    avatar: user.avatar
                });
            }
            catch (error) {
                
                this.logger.error('<PassAuthMiddleware> - Error: ' + error.message);
                return done(error.message);
            }
        
        }));
        
        // Serializes the user for the session
        Passport.serializeUser((user, done) => {
        
            done(null, {
                id: user.id,
                name: user.name,
                profiles: user.profiles,
                avatar: user.avatar
            });
        });
        
        // Deserializes the user of the session
        Passport.deserializeUser(async (user, done) => {
        
            try {
        
                const _user = await this.usersService.getUserById(user?.id);
                done(null, {
                    id: _user.id,
                    name: _user.name,
                    profiles: _user.profiles,
                    avatar: _user.avatar
                });
            }
            catch (error) {
        
                done(error.message);
            }
        });
    }
}

module.exports = AuthPassStrategyMiddleware;