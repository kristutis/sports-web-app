const Joi = require('joi')

function validateTrainerRating(req, res, next) {
    const schema = Joi.number()
        .min(0.1)
        .max(5)
        .required()

    const rating = req.body.rating
    const { error } = schema.validate(rating)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.rating = rating
    next()
}

module.exports = {
    validateTrainerRating
}
