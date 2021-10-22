const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');
const { validateId } = require('../middleware/common');
const { restoreProductToStoreAndUserMoney, validateOrderBody, validateOrderedProductExists, validateOrderExists } = require('../middleware/orders');

const router = new express.Router();

router.get('/api/orders', authenticateUser, async (req, res) => {
    const userId = req.user.id
    try {
        const results = await dbOperations.getOrdersByUserId(userId)
        res.status(200).json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/api/orders', 
    [
        authenticateUser,
        validateOrderBody,
        validateOrderedProductExists
    ], async (req, res) => {
    const user = await dbOperations.getUserByUserId(req.user.id)
    const orderDetails = req.orderDetails
    const product = req.product

    const quantity = orderDetails.quantity 

    try {
        const totalPrice = quantity * product.price
        if (totalPrice > user.money) {
            return res.status(400).json({error: 'not enough money'})
        }
        
        const order = {
            userId: user.id,
            productId: product.id,
            quantity: quantity,
            totalPrice: totalPrice,
        }
        await dbOperations.insertOrder(order)

        product.quantity -= quantity
        await dbOperations.updateProduct(product)

        user.money -= totalPrice
        await dbOperations.updateUser(user)

        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/orders/:id', 
    [
        validateId,
        authenticateUser,
        validateOrderBody,
        validateOrderExists,
        restoreProductToStoreAndUserMoney, 
        validateOrderedProductExists,
    ], async (req, res) => {
    const user = await dbOperations.getUserByUserId(req.user.id)
    const oldOrderId = req.order.order_id
    const orderDetails = req.orderDetails
    const product = req.product
    const quantity = orderDetails.quantity

    try {
        const totalPrice = quantity * product.price
        if (totalPrice > user.money) {
            return res.status(400).json({error: 'not enough money'})
        }
        
        //order.productId, order.quantity, order.totalPrice, order.orderId
        const updatedOrder = {
            productId: product.id,
            quantity: quantity,
            totalPrice: totalPrice,
            orderId: oldOrderId
        }
        await dbOperations.updateOrder(updatedOrder)

        product.quantity -= quantity
        await dbOperations.updateProduct(product)

        user.money -= totalPrice
        await dbOperations.updateUser(user)

        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/orders/:id', 
    [
        authenticateUser,
        validateId,
        validateOrderExists,
        restoreProductToStoreAndUserMoney
    ], async (req, res) => {
    const orderId = req.params.id
    try {
        await dbOperations.deleteOrder(orderId)
        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;