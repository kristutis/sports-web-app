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
        const commentExist = await dbOperations.getCommentByCommentId(commentId)
        if (!commentExist) {
            return res.status(400).send('comment does not exist')
        }
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
