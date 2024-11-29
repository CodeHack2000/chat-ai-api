const { OpenAI } = require('openai');

const config = require('../config/config');
const InventoryService = require('../services/inventoryService');
const ChatService = require('../services/chatService');
const SessionsHistoryService = require('../services/sessionsHistoryService');
const DbHistoryService = require('../services/dbHistoryService');

class OpenAiController {

    constructor(Utils, External, DB) {

        const { Logger } = Utils;
        const { ScrapingApiExternalService } = External;

        this.logger = Logger;
        this.scrapingApiExternalService = ScrapingApiExternalService;

        this.inventoryService = new InventoryService(Utils);
        this.chatService = new ChatService(Utils);
        this.sessionHistoryService = SessionsHistoryService;
        this.dbHistoryService = new DbHistoryService(Utils, DB);

        this.openAi = new OpenAI({
            apiKey: config.apiKey
        });
        this.mappedBasePromt = '';
        this.categories = [];

        this._initBasePrompt().then(() => this.logger.info('<OpenAiController> - Base prompt mapped'));
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

            this.logger.info('<OpenAiController> - Obtaining user history from session...');

            const userHistoryFromSession = this.sessionHistoryService.getHistoryFromUserSession(req.session);

            const userMessage = this.chatService.setHistoryInMessage(req.body.message, userHistoryFromSession);

            console.log(userMessage);

            this.logger.info('<OpenAiController> - Sending message to model...');

            const response = await this.openAi.chat.completions.create({
                model: 'gpt-4o-mini',
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                messages: [
                    {
                        role: 'system',
                        content: this.mappedBasePromt
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ]
            });

            console.log(response?.choices?.[0]?.message?.content);

            //await new Promise(resolve => setTimeout(resolve, 2000));

            this.logger.info('<OpenAiController> - Message sent to model.');

            const userHistoryFromMessage = this.chatService.getHistoryFromMessage(response?.choices?.[0]?.message?.content);

            this.logger.info('<OpenAiController> - User history parsed from message.');

            this.sessionHistoryService.saveHistoryInUserSession(req.session, userHistoryFromMessage);

            const regex = /###\[(.*?)\]/g;
            const match = regex.exec(response?.choices?.[0]?.message?.content);

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

            console.log('User ' + JSON.stringify(req.user));

            await this.dbHistoryService.insConversationIntoHistory(
                {
                    userMessage,
                    botMessage: result.message
                },
                req.user.id
            );

            result.message = this.chatService.cleanFinalMessage(result.message);
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