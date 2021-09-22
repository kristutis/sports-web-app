const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateAdmin } = require('../middleware/authentication');

const router = new express.Router();

router.get('/api/products', async (req, res) => {
    try {
        results = await dbOperations.getProducts()
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id
    try {
        results = await dbOperations.getProductById(productId)
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/api/products', authenticateAdmin, async (req, res) => {
    const product = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
    }
    try {
        await dbOperations.insertProduct(product)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/products', authenticateAdmin, async (req, res) => {
    const product = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
    }
    try {
        await dbOperations.updateProduct(product)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
    const productId = req.params.id
    try {
        await dbOperations.deleteProduct(productId)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;