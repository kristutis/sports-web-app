const Joi = require('joi')
const dbOperations = require('../database/operations');

function validateOrderBody(req, res, next) {
    const schema = Joi.object({
        productId: Joi.number()
            .integer()
            .min(1)
            .required(),
        quantity: Joi.number()
            .integer()
            .min(1)
            .required()
    })

    const orderDetails = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }

    const { error } = schema.validate(orderDetails)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.orderDetails = orderDetails
    next()
}

async function validateOrderedProductExists(req, res, next) {
    const orderDetails = req.orderDetails
    try {
        const product = await dbOperations.getProductById(orderDetails.productId)
        if (!product) {
            return res.status(404).send('product does not exist');
        }
        if (product.quantity < orderDetails.quantity) {
            return res.status(400).send('ordered quantity exceeds quantity in store');
        }
        req.product = product
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

async function validateOrderExists(req, res, next) {
    const orderId = req.params.id
    const userId = req.user.id
    try {
        const order = await dbOperations.getOrderByOrderAndUserId(orderId, userId)
        if (!order) {
            return res.status(404).send('order does not exist');
        }
        req.order = order
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

async function restoreProductToStoreAndUserMoney(req, res, next) {
    const orderId = req.params.id
    const userId = req.user.id
    try {
        const order = await dbOperations.getOrderByOrderAndUserId(orderId, userId)
        if (!order) {
            return res.status(404).send('order does not exist');
        }
        
        const product = await dbOperations.getProductById(order.fk_product_id)
        product.quantity += order.quantity
        await dbOperations.updateProduct(product)

        const user = await dbOperations.getUserByUserId(userId)
        user.money += order.total_price
        await dbOperations.updateUser(user)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

module.exports = {
    validateOrderBody,
    validateOrderedProductExists,
    validateOrderExists,
    restoreProductToStoreAndUserMoney
}
