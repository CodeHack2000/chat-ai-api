require('dotenv').config({ path: '@env' });

module.exports = {
    scrapingApiHost: process.env.SCRAPING_API_HOST,
    scrapingApiPort: process.env.SCRAPING_API_PORT
};