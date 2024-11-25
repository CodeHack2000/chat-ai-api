const { OpenAI } = require('openai');

const config = require('../config/config');
const InventoryService = require('../services/inventoryService');
const ChatService = require('../services/chatService');

class OpenAiController {

    constructor(Utils, External) {

        const { Logger } = Utils;
        const {  ScrapingApiExternalService } = External;

        this.logger = Logger;
        this.scrapingApiExternalService = ScrapingApiExternalService;

        this.inventoryService = new InventoryService(Utils);
        this.chatService = new ChatService(Utils);

        this.openAi = new OpenAI({
            apiKey: config.apiKey
        });
        this.mappedBasePromt = '';
        this.categories = [];

        //! CORRIGIR
        //this._initBasePrompt().then(() => this.logger.info('<OpenAiController> - Base prompt mapped'));

        this.history = [];
    }

    async _initBasePrompt() {

        let tryCount = 0;
        while (this.categories.length === 0) {

            this.categories = this.scrapingApiExternalService.categories.map((category) => '- ' + category.name);

            if (this.categories) {

                this.mappedBasePromt = config.basePrompt.replace('###CATEGORIES###', this.categories.join('\n'));
            }
            else {

                tryCount++;
            }

            if (tryCount > 10) {

                this.logger.warn('<OpenAiController> - Failed to map base prompt');
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    async sendMessageToModel(req, res) {

        const result = {
            status: 400,
            message: ''
        };

        try {

            this.logger.info('<OpenAiController> - Sending message to model...');

            /*const response = await this.openAi.chat.completions.create({
                model: 'gpt-4o-mini',
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                messages: [
                    {
                        role: 'system',
                        content: config.basePrompt
                    },
                    {
                        role: 'user',
                        content: req.body.message
                    }
                ]
            });*/

            const response = {
                choices: [
                    {
                        message: {
                            content: 'Para aliviar a irritação na garganta, pode experimentar as seguintes medidas:\n\n- Beba líquidos quentes, como chá com mel, para acalmar a garganta.\n- Faça gargarejos com água morna e sal para ajudar a reduzir a inflamação.\n- Use pastilhas para a garganta que podem ajudar a aliviar a dor e a irritação.\n- Mantenha o ambiente humidificado para evitar que a garganta fique seca.\n\nSe a irritação persistir ou se acompanhar outros sintomas mais graves, como febre alta ou dificuldade em engolir, recomendo que consulte o seu médico de família.  \n  \n!!![{\'utilizador\': \'Irritação na garganta\', \'chat\': \'Sugestões para aliviar a irritação.\'}]\n\n'
                        }
                    }
                ]
            };

            await new Promise(resolve => setTimeout(resolve, 2000));

            this.logger.info('<OpenAiController> - Message sent to model.');

            this.history.push(...this.chatService.getHistoryFromMessage(response?.choices?.[0]?.message?.content));

            const regex = /###\[(.*?)\]/g;
            const match = regex.exec(response?.choices?.[0]?.message?.content);

            console.log(match);

            //! CORRIGIR
            if (match?.[1]) {

                const products = match[1]
                    .split(',')
                    .map((product) => product.trim());

                const dbProducts = await this.scrapingApiExternalService.verifyProducts(products);

                result.message = this.inventoryService.insertProductsDataIntoMessage(response?.choices?.[0]?.message?.content, dbProducts);
            }
            else {

                result.message = response?.choices?.[0]?.message?.content;
            }

            result.status = 200;
        }
        catch (error) {

            result.status = 500;
            this.logger.error('<OpenAiController> - Error: ' + error.message);
        }

        return res
            .status(result.status)
            .json(result.message);
    }
}

module.exports = OpenAiController;