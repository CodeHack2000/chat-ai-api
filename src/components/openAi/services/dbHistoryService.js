class DbHistoryService {

    constructor(Utils, DB) {

        const { Logger } = Utils;
        const { HistoryService } = DB;

        this.logger = Logger;
        this.historyService = HistoryService;
    }

    /**
     * Inserts a new conversation into the history database
     * @param {Object} [messages={}] - The conversation data to be inserted into the history
     * @param {number} [userId=null] - The user ID to be associated with the conversation
     * @returns {Promise<boolean>} - true if the conversation was inserted, false otherwise
     */
    async insConversationIntoHistory(messages = {}, userId = null) {

        this.logger.info('<DbHistoryService> - Inserting conversation into history');

        let result = null;

        try {

            const history = {
                userId: userId,
                userMessage: messages?.userMessage,
                botMessage: messages?.botMessage
            };

            result = await this.historyService.insHistory(history);
        }
        catch (error) {

            this.logger.error('<DbHistoryService> - Error: ' + error.message);
        }

        return !!result;
    }
}

module.exports = DbHistoryService;