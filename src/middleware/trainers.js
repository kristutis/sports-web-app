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

module.exports = {
    validateTrainerExists
}
