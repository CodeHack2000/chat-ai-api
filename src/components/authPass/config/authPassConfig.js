require('dotenv').config();

module.exports = {
    brevoSecret: process.env.BREVO_KEY,
    brevoJwtSecret: process.env.BREVO_JWT_SECRET,
    enterpriseEmail: process.env.ENTERPRISE_EMAIL
};