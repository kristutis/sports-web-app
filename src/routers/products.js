const express = require('express');
const dbOperations = require('../database/operations');

const router = new express.Router();

router.get('/api/products', async (req, res) => {
    console.log(req)
    try {
        results = await dbOperations.getProducts()
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;