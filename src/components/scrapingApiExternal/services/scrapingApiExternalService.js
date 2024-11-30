const Axios = require('axios');

const config = require('../config/config');

class ScrapingApiExternalService {

    constructor(Utils, Tools) {

        const { Logger } = Utils;
        const { AuthJsonWebTokenService } = Tools;

        this.logger = Logger;

        this.authJsonWebTokenService = AuthJsonWebTokenService;

        this.categories = [];

        this._getAllInventoryCategories().then(() => this.logger.info(`<ScrapingApiExternalService> - Obtained ${this.categories.length} categories`));
    }

    _getInternalHeaders() {

        return {
            authorization: `Bearer ${this.authJsonWebTokenService.generateInternalApiToken()}`
        };
    }

    /**
     * Gets all inventory categories from the Scraping API External service.
     *
     * @private
     * @async
     * @returns {Promise<void>}
     */
    async _getAllInventoryCategories() {

        try {

            this.logger.info('<ScrapingApiExternalService> - Getting all inventory categories...');

            const url = `http://${config.scrapingApiHost}:${config.scrapingApiPort}/inventoryExt/getAllCategories`;
            const headers = this._getInternalHeaders();

            const response = await Axios.get(url, { headers });

            this.categories.push(...response.data);
        }
        catch(error) {

            this.logger.error('<ScrapingApiExternalService> - Error: ' + error.message);
        }
    }

    /**
     * Verifies the products in the Scraping API External service.
     *
     * @param {Array<Object>} products - The products to verify.
     * @returns {Promise<Array<Object>>} - The verified products.
     */
    async verifyProducts(products = []) {

        const verifiedProducts = [];

        try {

            this.logger.info('<ScrapingApiExternalService> - Verifying products...');

            const url = `http://${config.scrapingApiHost}:${config.scrapingApiPort}/inventoryExt/verifyProducts`;
            const headers = this._getInternalHeaders();

            const response = await Axios.post(url, { products }, { headers });

            verifiedProducts.push(...response.data);

            this.logger.info(`<ScrapingApiExternalService> - Verified ${products.length} products`);
        }
        catch(error) {

            this.logger.error('<ScrapingApiExternalService> - Error: ' + error.message);
        }

        return verifiedProducts;
    }
}

module.exports = ScrapingApiExternalService;