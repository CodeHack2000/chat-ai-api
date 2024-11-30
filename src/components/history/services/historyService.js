const HistoryDB = require('../db/historyDB');
const HistoryMapper = require('../mapper/historyMapper');

class HistoryService {

    constructor(Utils) {

        const { Logger, CommonMapper } = Utils;

        this.logger = Logger;
        this.commonMapper = CommonMapper;
        
        this.historyMapper = new HistoryMapper(Utils);
    }

    /**
     * Insert a new history in the database
     * @param {Object} history new history to insert
     * @returns {Promise<number>} id of the new history
     */
    async insHistory( history ) {

        this.logger.info( '<HistoryService> - Inserting history' );

        const mappedHistory = this.historyMapper.insHistory( history );

        return await HistoryDB.insHistory( mappedHistory );
    }

    /**
     * Update a history
     * @param {Object} history history to update
     * @returns {Promise<boolean>} true if the history was updated, false otherwise
     */
    async updHistory( history ) {

        this.logger.info( '<HistoryService> - Updating history' );

        const mappedHistory = this.historyMapper.updHistory( history );

        return await HistoryDB.updHistory( mappedHistory );
    }

    /**
     * Get a history by id
     * @param {number} id id of the history
     * @returns {Promise<Object>} history with the given id
     */
    async getHistoryById(id) {

        this.logger.info( '<HistoryService> - Getting history by id' );

        const mappedId = this.commonMapper.toString( id );

        return await HistoryDB.getHistoryById( mappedId );
    }

    /**
     * Get all the history for a given user
     * @param {uuid} userId id of the user
     * @returns {Promise<Array<Object>>} all the history for the given user, ordered by createdAt DESC
     */
    async getAllUserHistory(userId) {

        this.logger.info( '<HistoryService> - Getting all user history' );

        const mappedUserId = this.commonMapper.toString( userId );

        const userHistories = await HistoryDB.getAllUserHistory( mappedUserId );
        return userHistories?.map((history) => this.historyMapper.getUserHistory( history?.dataValues ));
    }
}

module.exports = HistoryService;