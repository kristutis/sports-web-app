const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');

const router = new express.Router();

router.post('/api/trainer/rating', authenticateUser, async (req, res) => {
    const userId = req.user.id
    const trainerId = req.body.trainerId
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
        if (!(parseFloat(rating) >= 0 && parseFloat(rating) <= 5)) {
            return res.status(400).json({error: 'wrong rating format'}).send()
        }

        const ratingExist = await dbOperations.getRatingByUserAndTrainerIds(userId, trainerId)
        if (ratingExist) {
            await dbOperations.updateRating(ratingObject)
        } else {
            await dbOperations.insertRating(ratingObject) 
        }
        res.sendStatus(200)   
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;