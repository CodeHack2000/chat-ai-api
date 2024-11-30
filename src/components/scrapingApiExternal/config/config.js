require('dotenv').config({ path: '@env' });

module.exports = {
    scrapingApiHost: process.env.SCRAPING_API_HOST,
    scrapingApiPort: process.env.SCRAPING_API_PORT,
    internalApiSecret: process.env.INTERNAL_API_JWT_SECRET,
    host: process.env.HOST
};