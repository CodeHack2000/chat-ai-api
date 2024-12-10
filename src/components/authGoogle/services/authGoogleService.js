const Axios = require('axios');
const Sharp = require('sharp');

class AuthGoogleService {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Downloads a Google avatar image and resizes it to 200x200 pixels with quality 80.
     * 
     * @param {string} imageUrl - The URL of the image to download and resize.
     * @returns {Promise<Buffer|null>} The resized image as a Buffer or null if an error occurred.
     */ 
    async getGoogleAvatar(imageUrl) {

        let image = null;

        try {

            this.logger.info('<AuthGoogleService> - Start getGoogleAvatar');

            const response = await Axios.get(imageUrl, { responseType: 'arraybuffer' });

            image = await Sharp(response.data)
                .resize({ width: 200, height: 200 })
                .jpeg({ quality: 80 })
                .toBuffer();    
        }
        catch (error) {

            this.logger.error('<AuthGoogleService> - Error: ' + error.message);
        }

        return image;
    }
}

module.exports = AuthGoogleService;