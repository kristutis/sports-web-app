const Joi = require('joi')
const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser, ADMIN_ROLE } = require('../middleware/authentication');
const { validateId } = require('../middleware/common');
const { validateTrainerComment, validateCommentExists } = require('../middleware/trainerComments');
const { validateTrainerExists } = require('../middleware/trainers');

const router = new express.Router();

router.get('/api/trainers/:id/comments', 
    [
        validateId,
        validateTrainerExists
    ], async (req, res) => {
    const trainerId = req.params.id
    try {
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
        validateTrainerComment,
        validateTrainerExists
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
        validateTrainerComment,
        validateCommentExists
    ], async (req, res) => {
    const existingComment = req.commentObject;
    const user = req.user
    const commentId = req.params.id
    const newComment = req.comment
    
    try {
        if (existingComment.fk_user_id == user.id || user.role == ADMIN_ROLE) {
            await dbOperations.updateComment(newComment, commentId)
            res.sendStatus(200)
        } else {
            res.sendStatus(403)
        }        
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/trainers/comments/:id', 
    [
        authenticateUser,
        validateId,
        validateCommentExists
    ], async (req, res) => {
    const existingComment = req.commentObject;
    const user = req.user
    const commentId = req.params.id
    try {
        if (existingComment.fk_user_id == user.id || user.role == ADMIN_ROLE) {
            await dbOperations.deleteComment(commentId)
            res.sendStatus(204)
        } else {
            res.sendStatus(403)
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})



module.exports = router;