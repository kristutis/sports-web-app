const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');

const router = new express.Router();

router.get('/api/trainer/:tid/comments', async (req, res) => {
    const trainerId = req.params.tid

    try {
        const result = await dbOperations.getCommentsByTrainerId(trainerId)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

router.post('/api/trainer/comments', authenticateUser, async (req, res) => {
    const userId = req.user.id
    const trainerId = req.body.trainerId
    const comment = req.body.comment

    const commentObject = {
        userId: userId,
        trainerId: trainerId,
        comment: comment
    }

    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(400).json({error: 'trainer does not exist'}).send()
        }

        await dbOperations.insertComment(commentObject)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/trainer/comments', authenticateUser, async (req, res) => {
    console.log(req.body)
    const commentId = req.body.commentId
    const comment = req.body.comment
    
    try {
        await dbOperations.updateComment(comment, commentId)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/trainer/comments/:id', authenticateUser, async (req, res) => {
    const commentId = req.params.id
    try {
        await dbOperations.deleteComment(commentId)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;