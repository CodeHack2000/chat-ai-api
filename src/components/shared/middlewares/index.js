class SharedMiddlewares {

    constructor() {

        this.errorHandlerMiddleware = require('./errorHandlerMiddleware');
        this.imageFormHandlingMiddleware = require('./imageFormHandlingMiddleware');
        this.schemaValidationMiddleware = require('./schemaValidationMiddleware');
    }
};

module.exports = new SharedMiddlewares();