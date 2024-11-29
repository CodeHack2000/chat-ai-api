class SessionsHistoryService {

    /**
     * Saves the given history in the user session.
     * If the session doesn't have a history, it will be created.
     * The history is an array of objects with the following properties:
     * - message: the message sent by the user
     * - response: the response given by the model
     * - timestamp: the timestamp of the message
     *
     * @param {Object} session - The user session
     * @param {Array<Object>} history - The history to save
     */
    static saveHistoryInUserSession(session, history) {

        if (!session.history) {

            session.history = [];
            session.history.push(...history);
        }
        else {

            session.history = [...history];
        }
    }

    /**
     * Retrieves the history from the user session.
     * If no history exists, an empty array is returned.
     *
     * @param {Object} session - The user session
     * @returns {Array<Object>} - The history from the session
     */
    static getHistoryFromUserSession(session) {

        return session?.history || [];
    }
}

module.exports = SessionsHistoryService;