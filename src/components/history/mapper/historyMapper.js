const Moment = require('moment');

class HistoryMapper {

    constructor(Utils) {

        const { CommonMapper } = Utils;

        this.commonMapper = CommonMapper;
    }

    /**
     * Maps an history to a database model
     * @param {Object} history history to map
     * @returns {Object} mapped history
     */
    insHistory(history) {

        return {
            userId: history?.userId,
            userMessage: this.commonMapper.toString( history?.userMessage ),
            botMessage: this.commonMapper.toString( history?.botMessage ),
            createdAt: Moment().toDate(),
            updatedAt: Moment().toDate()
        };
    };

    /**
     * Maps a history object to a database model for updating purposes
     * @param {Object} history history to update
     * @returns {Object} mapped history with updated fields
     */
    updHistory(history) {

        return {
            id: this.commonMapper.toString( history?.id ),
            userId: history?.userId,
            userMessage: this.commonMapper.toString( history?.userMessage ),
            botMessage: this.commonMapper.toString( history?.botMessage ),
            createdAt: Moment().toDate(),
            updatedAt: Moment().toDate()
        };
    }

    /**
     * Maps a history object to a user history object that can be sent to the client
     * @param {Object} _history history to map
     * @returns {Object} mapped user history
     */
    getUserHistory(_history) {

        const history = { ..._history };

        const productsRegex = /###\[.*?\]/g;
        const historyRegex = /!!!\[.*?\]/g;
        const trashRegex = /[#]{3}|[!]{3}/g;
        const productsPharmRegex = /\n\nForam encontrados os seguintes produtos à venda em Portugal:(.*)/s;

        const recommendedProductsMatch = productsPharmRegex.exec(history.botMessage);
        history.recommendedProducts = recommendedProductsMatch?.[1]?.trim() || '';

        history.botMessage = history.botMessage
            ?.replace(productsRegex, '')
            ?.replace(historyRegex, '')
            ?.replace(trashRegex, '')
            ?.replace(recommendedProductsMatch?.[0], '')
            ?.trim();

        history.userMessage = history.userMessage
            ?.replace(historyRegex, '')
            ?.trim();

        return history;
    }
}

module.exports = HistoryMapper;