const Joi = require('joi')
const dbOperations = require('../database/operations');

async function validateTrainerExists(req, res, next) {
    const trainerId = req.params.id
    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(404).send('trainer does not exist');
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

function validateTrainerBody(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(255)
            .required(),
        surname: Joi.string()
            .min(1)
            .max(255)
            .required(),
        price: Joi.number()
            .min(0.1)
            .required(),
        description: Joi.string()
            .min(1)
            .required(),
        moto: Joi.string()
            .min(1)
            .max(255)
            .required(),
    })

    const trainer = {
        name: req.body.name,
        surname: req.body.surname,
        price: req.body.price,
        description: req.body.description,
        moto: req.body.moto,
    }
    const { error } = schema.validate(trainer)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.trainer = trainer
    next()
}

module.exports = {
    validateTrainerExists,
    validateTrainerBody
}
