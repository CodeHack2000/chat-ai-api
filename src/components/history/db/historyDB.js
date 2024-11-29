const { history } = require('@models');

class HistoryDB {

    /**
     * Insert a new history in the database
     * @param {Object} historyData new history to insert
     * @returns {Promise<number>} id of the new history
     */
    static async insHistory(historyData) {

        const createHistory = await history.create(historyData);

        return createHistory.id;
    }

    /**
     * Update a history
     * @param {Object} historyData history to update
     * @returns {Promise<boolean>} true if the history was updated, false otherwise
     */
    static async updHistory(historyData) {

        const affectedRows = await history.update(

            historyData,
            {
                where: {
                    id: historyData.id
                }
            }
        );

        return !!affectedRows?.[0];
    }

    /**
     * Get a history by id
     * @param {number} id id of the history
     * @returns {Promise<Object>} history with the given id
     */
    static async getHistoryById(id) {

        return await history.findByPk(id);
    }
}

module.exports = HistoryDB;