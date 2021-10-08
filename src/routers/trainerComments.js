const Joi = require('joi')
const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');
const { validateId } = require('../middleware/common');
const { validateTrainerComment } = require('../middleware/trainerComments');

const router = new express.Router();

router.get('/api/trainers/:id/comments', validateId, async (req, res) => {
    const trainerId = req.params.id
    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(404).send('trainer does not exist');
        }

        const result = await dbOperations.getCommentsByTrainerId(trainerId)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

router.post('/api/trainers/:id/comments', 
    [
        authenticateUser,
        validateId,
        validateTrainerComment
    ], async (req, res) => {
    const userId = req.user.id
    const trainerId = req.params.id
    const comment = req.comment

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
        res.sendStatus(201)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/trainers/comments/:id', 
    [
        authenticateUser,
        validateId,
        validateTrainerComment
    ], async (req, res) => {
    const commentId = req.params.id
    const comment = req.comment
    
    try {
        const commentExist = await dbOperations.getCommentByCommentId(commentId)
        if (!commentExist) {
            return res.status(400).send('comment does not exist')
        }

        await dbOperations.updateComment(comment, commentId)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/trainers/comments/:id', 
    [
        authenticateUser,
        validateId
    ], async (req, res) => {
    const commentId = req.params.id
    try {
        const commentExist = await dbOperations.getCommentByCommentId(commentId)
        if (!commentExist) {
            return res.status(400).send('comment does not exist')
        }

        await dbOperations.deleteComment(commentId)
        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})



module.exports = router;