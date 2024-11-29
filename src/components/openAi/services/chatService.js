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

    /**
     * Sets the history in a message sent by user.
     * 
     * @param {string} message - The message sent by the user.
     * @param {Array<Object>} history - The history to set in the message.
     * @returns {string} - The message with the history set.
     */
    setHistoryInMessage(message, history) {

        this.logger.info('<ChatService> - Setting history in message...');

        return history?.length > 0
            ? message + '\n\n!!!' + JSON.stringify(history)
            : message;
    }

    /**
     * Cleans the final message by removing the products and history 
     * from it, leaving only the OpenAI response.
     * 
     * @param {string} message - The final message to clean.
     * @returns {string} - The cleaned message.
     */
    cleanFinalMessage(message) {

        const productsRegex = /###\[.*?\]/g;
        const historyRegex = /!!!\[.*?\]/g;
        const trash = /[#]{3}|[!]{3}/g;

        return message
            .replace(productsRegex, '')
            .replace(historyRegex, '')
            .replace(trash, '');
    }
}

module.exports = ChatService;