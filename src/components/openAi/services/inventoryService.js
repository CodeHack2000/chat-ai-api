const Moment = require('moment');

class InventoryService {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Inserts the products data into the message returned by the OpenAI model.
     * 
     * @param {string} message - The message returned by the OpenAI model.
     * @param {Array<Object>} products - The products data to be inserted into the message.
     * @returns {string} - The final message with the products data inserted.
     */
    insertProductsDataIntoMessage(message = '', products = []) {

        const finalMessage = [];
        const regex = /###\[.*?\]/g;
        
        for (const index in products) {

            if (index === 0) {

                const cleanMessage = message.replace(regex, '') + '\n\nForam encontrados os seguintes produtos à venda em Portugal: \n\n';

                finalMessage.push(cleanMessage);
            }

            const product = products[index];
            const msg = `1. ${product.productName} - ${product.price}€\nFarmácia: ${product.websiteName}\n${product.productUrl}\nÚltima atualização: ${Moment(product.lastCheck).format('YYYY-MM-DD')}\n\n`;

            finalMessage.push(msg);
        }

        return finalMessage.join('');
    }
}

module.exports = InventoryService;