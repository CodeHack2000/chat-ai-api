const Sharp = require('sharp');

class ImageService {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Validates an image buffer and returns a transformed image
     * @param {Buffer} image image buffer to validate and transform
     * @returns {Promise<Object>} result object with the transformed image and a list of errors
     * @throws {Error} if an error occurs during the validation and transformation process
     */
    async validateImage(image) {

        const result = {
            image: null,
            errors: []
        };

        try {

            this.logger.info('<ImageService> - Start Validate Image');

            // Obtain the image metadata
            const metadata = await Sharp(image).metadata();

            // Validate the image format
            if (!['jpeg', 'jpg', 'png'].includes(metadata.format)) {

                result.errors.push(`The image format ${metadata.format} is not supported. Supported formats: jpeg, jpg, png.`);
            }

            // Validate the image size
            if (metadata.width < 200 || metadata.height < 200) {

                result.errors.push('The image must be at least 200x200 pixels.');
            }

            // Return transformed image
            if (result.errors.length === 0) {

                result.image = await Sharp(image)
                    .resize({ width: 200, height: 200 })
                    .jpeg({ quality: 80 })
                    .toBuffer();
            }
        }
        catch (error) {

            this.logger.error('<ImageService> - Error: ' + error.message);
            result.errors.push(error.message);
        }

        return result;
    }
}

module.exports = ImageService;