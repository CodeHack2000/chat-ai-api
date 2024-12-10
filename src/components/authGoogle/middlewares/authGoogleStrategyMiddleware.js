const Passport = require('passport');
const { Strategy } = require('passport-google-oauth2');

const AuthConfig = require('../config/authGoogleConfig');
const AuthGoogleService = require('../services/authGoogleService');

class AuthGoogleStrategyMiddleware {

    constructor(Utils, DB) {

        const { Logger } = Utils;
        const { UsersService } = DB;

        this.logger = Logger;
        this.usersService = UsersService;

        this.authGoogleService = new AuthGoogleService(Utils);

        this._configStrategy();
    }

    /**
     * Configures the strategy to work with Google oauth2
     * @private
     */
    _configStrategy() {

        // Configures the strategy to work with Google oauth2
        Passport.use(new Strategy({

            clientID: AuthConfig.clientId,
            clientSecret: AuthConfig.secret,
            callbackURL: AuthConfig.callbackUrl,
            passReqToCallback: true
        },
        // AccessToken && RefreshToken need to access other google services for this user
        async (request, accessToken, refreshToken, profile, done) => {

            try {

                console.log(profile);

                this.logger.info('<GoogleAuthMiddleware> - Start Login');

                // Check if the profile has an id
                if (!profile?.id) {

                    this.logger.warn('<GoogleAuthMiddleware> - Invalid profile');
                    return done(null, false, 'Invalid profile');
                }

                this.logger.info('<GoogleAuthMiddleware> - Obtains user by google id');
                let user = await this.usersService.getUserByGoogleId(profile);

                // Check if the user already exists by the google id
                if (!user?.id) {

                    this.logger.info('<GoogleAuthMiddleware> - User not found, try to get by email');
                    // Try to get the user by email
                    user = await this.usersService.getUserByEmail(profile?.email);
                }

                // If the user doesn't exist, insert it
                if (!user?.id) {

                    this.logger.info('<GoogleAuthMiddleware> - User not found, try to insert it');
                    const imageBuffer = await this.authGoogleService.getGoogleAvatar(profile?.picture);
                    user = await this.usersService.insGoogleUser(profile, imageBuffer);
                }
                // If the user exists, but the googleId is null, update it
                else if (!user?.googleId) {

                    this.logger.info('<GoogleAuthMiddleware> - User found, but googleId is null, try to update it');

                    const imageBuffer = await this.authGoogleService.getGoogleAvatar(profile?.picture);

                    user.googleId = profile?.id,
                    user.image = user?.avatar || imageBuffer;

                    await this.usersService.updUser(user);
                }

                // If the user was not inserted or updated, return an error
                if (!user?.id) {

                    this.logger.warn('<GoogleAuthMiddleware> - Invalid user');
                    return done(null, false, { message: 'Invalid user' });
                }

                this.logger.info('<GoogleAuthMiddleware> - Login Successful');
                this.logger.debug('<GoogleAuthMiddleware> - user: ' + user?.id);
                return done(null, {
                    id: user.id,
                    name: user.name,
                    profiles: user.profiles,
                    avatar: user.avatar
                });
            }
            catch (error) {

                this.logger.info('<GoogleAuthMiddleware> - Error: ' + error.message);
                return done(error.message);
            }
        })
        );

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

                const user = await this.usersService.getUserById(user?.id);
                done(null, {
                    id: user.id,
                    name: user.name,
                    profiles: user.profiles,
                    avatar: user.avatar
                });
            }
            catch (error) {

                done(error.message);
            }
        });
    }
};

module.exports = AuthGoogleStrategyMiddleware;