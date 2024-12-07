const Path = require('path');
require('dotenv').config({ path: Path.resolve(__dirname, '../../.env') });

module.exports = {
    port: process.env.PORT || 3100,
    env: process.env.NODE_ENV || 'development',
    sessionSecret: process.env.SESSION_SECRET,
    host: process.env.HOST,
    externalHost: process.env.EXTERNAL_HOST,
    appName: process.env.APP_NAME,
    frontEndHost: process.env.FRONTEND_HOST,
    frontEndPort: process.env.FRONTEND_PORT
};
