const Joi = require('joi')

function validateTrainerComment(req, res, next) {
    const schema = Joi.string()
        .min(1)
        .max(255)
        .required()

    const comment = req.body.comment
    const { error } = schema.validate(comment)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.comment = comment
    next()
}

module.exports = {
    validateTrainerComment
}
