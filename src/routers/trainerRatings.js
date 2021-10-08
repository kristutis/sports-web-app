const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');
const { validateId } = require('../middleware/common');
const { validateTrainerRating } = require('../middleware/trainerRatings');

const router = new express.Router();

router.get('/api/ratings', async (req, res) => {
    try {
        const result = await dbOperations.getRatings()
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

router.get('/api/trainers/:id/ratings', validateId, async (req, res) => {
    const trainerId = req.params.id

    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(404).send('trainer does not exist');
        }

        const result = await dbOperations.getRatingsByTrainerId(trainerId)
        res.status(200).json(result).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

router.get('/api/trainers/:id/ratings/average', validateId, async (req, res) => {
    const trainerId = req.params.id

    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(400).send('trainer does not exist');
        }

        const result = await dbOperations.getRatingsByTrainerId(trainerId)
        if (!result.length) {
            return res.status(404).send('trainer does not have ratings');
        }

        const ratings = result.map(r => r.rating)
        const averageRating = ratings.reduce((a, b) => (a + b)) / ratings.length;
        res.status(200).json(averageRating)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

router.post('/api/trainers/:id/ratings', 
    [
        authenticateUser,
        validateId,
        validateTrainerRating
    ], async (req, res) => {
    const userId = req.user.id
    const trainerId = req.params.id
    const rating = req.rating

    const ratingObject = {
        userId: userId,
        trainerId: trainerId,
        rating: rating
    }

    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(400).json({error: 'trainer does not exist'}).send()
        }

        const ratingExist = await dbOperations.getRatingByUserAndTrainerIds(userId, trainerId)
        console.log(ratingExist)
        if (ratingExist) {
            await dbOperations.updateRating(ratingObject)
        } else {
            await dbOperations.insertRating(ratingObject) 
        }
        res.sendStatus(201)   
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/trainers/:id/ratings', 
    [
        authenticateUser,
        validateId,
        validateTrainerRating
    ], async (req, res) => {
    const userId = req.user.id
    const trainerId = req.params.id
    const rating = req.body.rating

    const ratingObject = {
        userId: userId,
        trainerId: trainerId,
        rating: rating
    }

    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(400).json({error: 'trainer does not exist'}).send()
        }

        await dbOperations.updateRating(ratingObject)
        res.sendStatus(200)   
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/trainers/:id/ratings', 
    [
        authenticateUser,
        validateId
    ], async (req, res) => {
    const userId = req.user.id
    const trainerId = req.params.id
    
    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(400).json({error: 'trainer does not exist'}).send()
        }

        await dbOperations.deleteRating(userId, trainerId)
        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;