const Brevo = require('sib-api-v3-sdk');

const serverConfig = require('@config/serverConfig');

const authPassConfig = require('../config/authPassConfig');

class BrevoEmailService {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Sends an email with a confirmation link to the entity
     * @param {string} email email of the entity
     * @param {string} token token to confirm the entity
     * @returns {Promise<Object>} response of the mail service
     * @throws {Error} if the email, token or apiKey are undefined or null
     */
    async sendEmailConfirmation(email, token) {
        
        this.logger.info('<BrevoEmail> - Start Send Email Confirmation');

        if (!email) {

            this.logger.warn('<BrevoEmail> - Email is null or undefined');
            throw new Error('Email is null or undefined');
        }

        if (!token) {

            this.logger.warn('<BrevoEmail> - Token is null or undefined');
            throw new Error('Token is null or undefined');
        }

        let response;

        const client = Brevo.ApiClient.instance;
        const apiKey = client.authentications['api-key'];

        if (!apiKey) {

            this.logger.warn('<BrevoEmail> - ApiKey is null or undefined');
            throw new Error('ApiKey is null or undefined');
        }

        apiKey.apiKey = authPassConfig.brevoSecret;

        const apiInstance = new Brevo.TransactionalEmailsApi();
        const sendSmtpEmail = new Brevo.SendSmtpEmail();

        const confirmationUrl = `${serverConfig.externalHost}:${serverConfig.port}/auth/pass/confirm-email?token=${token}`;

        sendSmtpEmail.to = [{ email }],
        sendSmtpEmail.sender = { email: authPassConfig.enterpriseEmail, name: serverConfig.appName },
        sendSmtpEmail.subject = 'Confirm your email',
        sendSmtpEmail.htmlContent = `<p>Click <a href="${confirmationUrl}">here</a> to confirm your email</p>`;

        try {

            response = await apiInstance.sendTransacEmail(sendSmtpEmail);
            this.logger.info('<BrevoEmail> - Success Send Email Confirmation');
        }
        catch (error) {

            this.logger.error('<BrevoEmail> - Error Send Email Confirmation', error.message);
            throw error;
        }

        return response?.messageId;
    }
};

module.exports = BrevoEmailService;