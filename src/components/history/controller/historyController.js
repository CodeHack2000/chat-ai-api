class HistoryController {

    constructor(Utils, DB) {

        const { Logger } = Utils;
        const { HistoryService } = DB;

        this.logger = Logger;
        this.historyService = HistoryService;
    }

    /**
     * Gets the user's history
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise<Response>} response with the user's history
     */
    async getUserHistory(req, res) {

        const result = {
            status: 400,
            history: []
        };

        try {

            this.logger.info( '<HistoryController> - Getting user history' );

            result.history = await this.historyService.getAllUserHistory(req.user.id);

            this.logger.info( '<HistoryController> - User history obtained' );

            result.status = 200;
        }
        catch (error) {

            this.logger.error( '<HistoryController> - Error: ' + error.message );
            result.status = 500;
        }

        return res
            .status( result.status )
            .json( result.history );
    }
}

module.exports = HistoryController;