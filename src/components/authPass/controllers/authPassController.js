const AuthPassHashingService = require('../services/authPassHashingService');
const JsonWebTokenService = require('../services/jsonWebTokenService');
const BrevoEmailService = require('../services/brevoEmailService');

class AuthPassController {

    constructor(Utils, DB) {

        const { Logger, CommonMapper } = Utils;
        const { UsersService } = DB; 

        this.logger = Logger;
        this.commonMapper = CommonMapper;
        this.usersService = UsersService;

        this.jsonWebTokenService = new JsonWebTokenService(Utils);
        this.brevoEmailService = new BrevoEmailService(Utils);
        this.authPassHashingService = new AuthPassHashingService(Utils);
    }

    /**
     * Register a new user
     * @param {Object} req.body user data
     * @returns {Promise<Object>} result of the operation
     */
    async register(req, res) {

        const result = {
            status: 400,
            message: ''
        };
    
        try {
    
            this.logger.info('<AuthPass> - Start Register');

            const userData = { ...req.body };

            const user = await this.usersService.getUserByEmail(userData?.email);
            
            this.logger.info('<AuthPass> - User obtained');
            
            // Verify if the user is already registered
            if (
                user?.email 
                && user?.password 
                && user?.emailValidationState === 'validated'
            ) {
                
                this.logger.info('<AuthPass> - User already registered');
                res.status = 409;
                result.message = 'User already registered';
            }
            // Verify if the user email is in validation
            else if (
                user?.email 
                && user?.password 
                && user?.emailValidationState === 'inValidation'
            ) {
                
                this.logger.info('<AuthPass> - User email in validation');
                result.status = 202;
                result.message = 'User email in validation';
            }
            else {
                
                // Hash de password
                userData.password = await this.authPassHashingService.hashPassword(userData?.password);
                
                // Set the email validation state to 'inValidation'
                userData.emailValidationState = 'inValidation';
                
                // If the user have been logged with google, set the password
                if (user?.email && user?.googleId) {
                    
                    // Fill empty properties of the user with the data received
                    const userToDb = this.commonMapper.fillEmptyProperties(user.dataValues, userData);
                    
                    await this.usersService.updUser(userToDb);
                    
                    this.logger.info('<AuthPass> - User updated');
                    result.status = 200;
                    result.message = 'User updated successfully';
                }
                // If the user have not been logged with google, insert the user
                else {
                    
                    userData.id = await this.usersService.insUser(userData);
                    
                    this.logger.info('<AuthPass> - User inserted');
                    result.status = 201;
                    result.message = 'Created user ' + userData.id;
                }
                
                // Generate email validation token
                const token = this.jsonWebTokenService.generateConfirmationToken(userData.email);
                
                // Send email with validation token
                await this.brevoEmailService.sendEmailConfirmation(userData.email, token);
            }
        }
        catch (error) {
            
            this.logger.error('<AuthPass> - Error Register: ' + error.message);
            result.message = 'Some error ocurried';
            result.status = 500;
        }
        
        return res
            .status(result.status)
            .json(result.message);
    }

    /**
     * Confirms the user email by a validation token
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} response with the result of the operation
     */
    async emailConfirm(req, res) {

        const { token } = req.query;
        const result = {
            status: 400,
            message: ''
        };

        try {

            this.logger.info('<AuthPass> - Start Email Confirm');

            const decoded = this.jsonWebTokenService.verifyConfirmationToken(token);

            const user = await this.usersService.getUserByEmail(decoded?.email);

            if (!user?.id || user?.emailValidationState !== 'inValidation') {

                this.logger.warn('<AuthPass> - Invalid token or user not in validation');
                result.message = 'The confirmation token is invalid';
            }
            else {

                user.emailValidationState = 'validated';
                await this.usersService.updUser(user.dataValues);

                this.logger.info('<AuthPass> - User validated');
                result.message = 'User validated successfully';
                result.status = 200;
            }
        }
        catch (error){

            this.logger.error('<AuthPass> - Error Email Confirm: ' + error.message);
            result.message = 'Some error ocurried';
            result.status = 500;
        }

        return res
            .status(result.status)
            .json(result.message);
    }

    async login(req, res) {

        this.logger.info('<AuthPass> - Start Login');

        return res.redirect('/home');
    }
}

module.exports = AuthPassController;