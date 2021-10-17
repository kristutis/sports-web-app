const Joi = require('joi')
const dbOperations = require('../database/operations');

function validateProductBody(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(255)
            .required(),
        description: Joi.string()
            .min(1)
            .max(255)
            .required(),
        price: Joi.number()
            .min(0.1)
            .required(),
        quantity: Joi.number()
            .integer()
            .min(1)
            .required()
    })

    const product = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
    }
    const { error } = schema.validate(product)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.product = product
    next()
}

async function validateProductsExists(req, res, next) {
    const productId = req.params.id
    try {
        const productExist = await dbOperations.getProductById(productId)
        if (!productExist) {
            return res.status(404).send('product does not exist');
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

module.exports = {
    validateProductBody,
    validateProductsExists
}
