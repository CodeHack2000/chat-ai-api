const Joi = require('joi');

exports.sendMessageToModelSchema = Joi.object({
    message: Joi.string().min(3).required()
});