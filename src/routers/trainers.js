const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateAdmin } = require('../middleware/authentication');
const { validateId } = require('../middleware/common');
const { validateTrainerExists, validateTrainerBody } = require('../middleware/trainers');


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
    try {
        results = await dbOperations.getTrainerById(trainerId)
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/api/trainers', 
    [
        authenticateAdmin,
        validateTrainerBody
    ], async (req, res) => {
    const trainer = req.trainer
    try {
        await dbOperations.insertTrainer(trainer)
        res.sendStatus(201)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/trainers/:id', 
    [
        authenticateAdmin,
        validateId,
        validateTrainerBody,
        validateTrainerExists
    ], async (req, res) => {
    const trainerId = req.params.id
    const trainer = req.trainer
    trainer.id = trainerId
    
    try {
        await dbOperations.updateTrainer(trainer)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/trainers/:id', 
    [
        authenticateAdmin,
        validateId,
        validateTrainerExists
    ], async (req, res) => {
    const trainerId = req.params.id
    try {
        await dbOperations.deleteTrainer(trainerId)
        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;