const Joi = require('joi')

function validateId(req, res, next) {
    const schema = Joi.number().integer().required()

    const id = req.params.id
    const { error } = schema.validate(id)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    next()
}

module.exports = {
    validateId
}
