const Path = require('path');
require('dotenv').config({ path: Path.resolve(__dirname, '@env') });

module.exports = {
    clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
    secret: process.env.GOOGLE_OAUTH2_SECRET,
    callbackUrl: process.env.GOOGLE_OAUTH2_CALLBACK
};
