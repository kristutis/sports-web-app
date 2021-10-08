const Joi = require('joi')
const dbOperations = require('../database/operations');

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

async function validateRatingExists(req, res, next) {
    const userId = req.user.id
    const trainerId = req.params.id
    try {
        const rating = await dbOperations.getRatingByUserAndTrainerIds(userId, trainerId)
        if (!rating) {
            return res.status(400).send('rating does not exist')
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

module.exports = {
    validateTrainerRating,
    validateRatingExists
}
