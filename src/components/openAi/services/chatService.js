class ChatService {
    
    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Gets the history from a message returned by the OpenAI model.
     * 
     * @param {string} message - The message returned by the OpenAI model.
     * @returns {Array<Object>} - The history parsed from the message.
     */
    getHistoryFromMessage(message) {

        const parsedHistory = [];

        try {

            this.logger.info('<ChatService> - Getting history from message...');

            const regex = /!!!(\[.*?\])/;
            const history = regex.exec(message);

            const formattedHistory = history?.[1]?.replace(/'/g, '"');

            parsedHistory.push(...JSON.parse(formattedHistory));
        }
        catch (error) {

            this.logger.error('<ChatService> - Error: ' + error.message);
        }

        return parsedHistory;
    }
}

module.exports = ChatService;