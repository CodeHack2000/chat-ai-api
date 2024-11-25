// Load aliases
require('module-alias/register');

const App = require('./app');
const Utils = require('@utils');

// Config
const ServerConfig = require('@config/serverConfig');

// Utils
const utils = new Utils();

const startServer = async () => {

    try {

        App.listen(ServerConfig.port, () => {

            utils.logger.info(`Server is running on ${ServerConfig.port} port`);
        });
    }
    catch (error) {

        utils.logger.error('Server - Error: ' + error.message);
        process.exit(1);
    }
};

startServer();
