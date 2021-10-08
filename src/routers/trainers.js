const express = require('express');
const dbOperations = require('../database/operations');

const router = new express.Router();

router.get('/api/trainers', async (req, res) => {
    try {
        results = await dbOperations.getTrainers()
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/api/trainers/:id', async (req, res) => {
    const trainerId = req.params.id
    console.log('there')
    try {
        results = await dbOperations.getTrainerById(trainerId)
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})


module.exports = router;