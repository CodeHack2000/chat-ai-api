const ImageService = require('../services/imageService');

class UserController {

    constructor(Utils, DB) {

        const { Logger } = Utils;
        const { UsersService } = DB;

        this.logger = Logger;
        this.usersService = UsersService;
        
        this.imageService = new ImageService(Utils);
    }

    /**
     * Updates the user's avatar image
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} response with the result of the operation
     */
    async updateUserImage(req, res) {

        const result = {
            status: 400,
            message: '',
            success: false
        };

        try {

            this.logger.info('<UsersController> - Start Update User Image');

            const imageValidation = await this.imageService.validateImage(req.file.buffer);

            if (imageValidation.errors.length > 0) {

                result.message = imageValidation.errors.join(', ');
            }
            else if (imageValidation.image) {

                // Update the user image
                const user = await this.usersService.getUserById(req.user.id);
                user.image = imageValidation.image;
                await this.usersService.updUser(user);

                // Update user's session
                req.session.passport.user.avatar = imageValidation.image;

                result.success = true;
                result.status = 200;
                result.message = 'The user image has been updated';
            }
        }
        catch (error) {

            this.logger.error('<UsersController> - Error: ' + error.message);
            result.message = error.message;
            result.status =  500;
        }

        return res
            .status(result.status)
            .json({ message: result.message, success: result.success });
    }
}

module.exports = UserController;