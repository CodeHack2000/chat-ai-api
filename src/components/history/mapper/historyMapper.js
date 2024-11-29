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
}

module.exports = HistoryMapper;