const Joi = require('joi')
const dbOperations = require('../database/operations');

function validateTrainerComment(req, res, next) {
    const schema = Joi.string()
        .min(1)
        .max(255)
        .required()

    const comment = req.body.comment
    const { error } = schema.validate(comment)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.comment = comment
    next()
}

async function validateCommentExists(req, res, next) {
    const commentId = req.params.id
    try {
        const comment = await dbOperations.getCommentByCommentId(commentId)
        if (!comment) {
            return res.status(404).send('comment does not exist')
        }
        req.commentObject = comment
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

module.exports = {
    validateTrainerComment,
    validateCommentExists
}
