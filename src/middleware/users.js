const Joi = require('joi')
const dbOperations = require('../database/operations');

function validateUser(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(50)
            .required(),
        surname: Joi.string()
            .min(1)
            .max(50)
            .required(),
        email: Joi.string()
            .min(1)
            .max(50)
            .required(),
        password: Joi.string()
            .min(1)
            .max(255)
            .required(),
    })

    const userDetails = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password
    }
    const { error } = schema.validate(userDetails)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.userDetails = userDetails
    next()
}

async function validateUserExists(req, res, next) {
    // const userId = req.user.id
    // const trainerId = req.params.id
    // try {
    //     const rating = await dbOperations.getRatingByUserAndTrainerIds(userId, trainerId)
    //     if (!rating) {
    //         return res.status(404).send('rating does not exist')
    //     }
    // } catch (e) {
    //     console.log(e)
    //     return res.sendStatus(500)
    // }
    // next()
}

module.exports = {
    validateUser,
    validateUserExists
}
