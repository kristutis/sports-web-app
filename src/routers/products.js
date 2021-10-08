const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateAdmin } = require('../middleware/authentication');
const { validateId } = require('../middleware/common');
const { validateProductBody, validateProductsExists } = require('../middleware/products');

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

router.get('/api/products/:id', validateId, async (req, res) => {
    const productId = req.params.id
    
    try {
        results = await dbOperations.getProductById(productId)
        if (!results) {
            return res.sendStatus(404)
        }
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/api/products', 
    [
        authenticateAdmin,
        validateProductBody
    ], async (req, res) => {
    const product = req.product
    try {
        await dbOperations.insertProduct(product)
        res.sendStatus(201)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/products/:id', 
    [
        authenticateAdmin,
        validateId,
        validateProductBody,
        validateProductsExists
    ], async (req, res) => {
    const productId = req.params.id
    const product = req.product
    product.id = productId
    try {
        await dbOperations.updateProduct(product)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/products/:id', 
    [
        authenticateAdmin,
        validateId,
        validateProductsExists
    ], async (req, res) => {
    const productId = req.params.id
    try {
        await dbOperations.deleteProduct(productId)
        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;