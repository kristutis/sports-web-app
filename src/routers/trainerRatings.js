const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');
const { validateId } = require('../middleware/common');
const { validateTrainerRating, validateRatingExists } = require('../middleware/trainerRatings');
const { validateTrainerExists } = require('../middleware/trainers');

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

router.get('/api/trainers/:id/ratings', 
    [
        validateId, 
        validateTrainerExists
    ], async (req, res) => {
    const trainerId = req.params.id

    try {
        const result = await dbOperations.getRatingsByTrainerId(trainerId)
        res.status(200).json(result).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

router.get('/api/trainers/:id/ratings/average', 
    [
        validateId,
        validateTrainerExists
    ], async (req, res) => {
    const trainerId = req.params.id

    try {
        const result = await dbOperations.getRatingsByTrainerId(trainerId)
        if (!result.length) {
            return res.status(404).send('trainer does not have ratings');
        }

        const ratings = result.map(r => r.rating)
        const averageRating = ratings.reduce((a, b) => (a + b)) / ratings.length;
        res.status(200).json(Math.round(averageRating * 100) / 100)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

router.post('/api/trainers/:id/ratings', 
    [
        authenticateUser,
        validateId,
        validateTrainerRating,
        validateTrainerExists
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
        const ratingExist = await dbOperations.getRatingByUserAndTrainerIds(userId, trainerId)
        if (ratingExist) {
            return res.status(400).send('Rating already exists')
        } else {
            await dbOperations.insertRating(ratingObject)
            return res.sendStatus(201)
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/trainers/:id/ratings', 
    [
        authenticateUser,
        validateId,
        validateTrainerRating,
        validateTrainerExists,
        validateRatingExists
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
        validateId,
        validateTrainerExists,
        validateRatingExists
    ], async (req, res) => {
    const userId = req.user.id
    const trainerId = req.params.id
    
    try {
        await dbOperations.deleteRating(userId, trainerId)
        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;