const Moment = require('moment');

class InventoryService {

    constructor(Utils) {

        const { Logger, CommonMapper } = Utils;

        this.logger = Logger;
        this.commonMapper = CommonMapper;
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
        
        for (const index in products) {

            const indexNumber = this.commonMapper.toInt(index);

            if (indexNumber === 0) {

                const cleanMessage = message + '\n\nForam encontrados os seguintes produtos à venda em Portugal: \n\n';

                finalMessage.push(cleanMessage);
            }

            const product = products[index];
            const msg = `${indexNumber + 1}. ${product.productName} - ${product.price}€\nFarmácia: ${product.websiteName}\n${product.productUrl}\nÚltima atualização: ${Moment(product.lastCheck).format('YYYY-MM-DD')}\n\n`;

            finalMessage.push(msg);
        }

        return finalMessage.join('');
    }
}

module.exports = InventoryService;