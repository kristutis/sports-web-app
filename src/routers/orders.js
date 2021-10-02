const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');

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

router.post('/api/orders', authenticateUser, async (req, res) => {
    const productId = req.body.productId
    const quantity = req.body.quantity

    try {
        const user = await dbOperations.getUserByUserId(req.user.id)
        const product = await dbOperations.getProductById(productId)
        if (!product) {
            return res.status(400).json({error: 'product does not exist'})
        }
        if (product.quantity < quantity) {
            return res.status(400).json({error: 'product quantity is less than ordered'})
        }

        const totalPrice = quantity * product.price
        if (totalPrice > user.money) {
            return res.status(400).json({error: 'not enough money'})
        }
        
        const order = {
            userId: user.id,
            productId: productId,
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

module.exports = router;