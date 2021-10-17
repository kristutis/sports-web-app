const Joi = require('joi')
const dbOperations = require('../database/operations');

function validateCreateUser(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(50)
            .required(),
        surname: Joi.string()
            .min(1)
            .max(50)
            .required(),
        email: Joi.string()
            .min(1)
            .max(50)
            .required(),
        password: Joi.string()
            .min(1)
            .max(255)
            .required(),
    })

    const userDetails = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password
    }
    const { error } = schema.validate(userDetails)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.userDetails = userDetails
    next()
}

function validateLoginUser(req, res, next) {
    const schema = Joi.object({
        email: Joi.string()
            .min(1)
            .max(50)
            .required(),
        password: Joi.string()
            .min(1)
            .max(255)
            .required(),
    })

    const userDetails = {
        email: req.body.email,
        password: req.body.password
    }
    const { error } = schema.validate(userDetails)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.userDetails = userDetails
    next()
}

async function validateUserExists(req, res, next) {
    userId = req.params.id
    try {
        const user = await dbOperations.getUserByUserId(userId)
        if (!user) {
            return res.status(404).send('User does not exist')
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}

function validateUpdateUserByAdmin(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(50)
            .required(),
        surname: Joi.string()
            .min(1)
            .max(50)
            .required(),
        email: Joi.string()
            .min(1)
            .max(50)
            .required(),
        password: Joi.string()
            .min(1)
            .max(255),
        money: Joi.number()
            .required(),
        role: Joi.number()
            .integer()
            .required()
    })

    const userDetails = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        money: req.body.money,
        role: req.body.role
    }
    const { error } = schema.validate(userDetails)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.userDetails = userDetails
    next()
}

function validateUpdateUserByUser(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(50)
            .required(),
        surname: Joi.string()
            .min(1)
            .max(50)
            .required(),
        email: Joi.string()
            .min(1)
            .max(50)
            .required(),
        password: Joi.string()
            .min(1)
            .max(255)
    })

    const userDetails = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
    }
    const { error } = schema.validate(userDetails)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    req.userDetails = userDetails
    next()
}

module.exports = {
    validateCreateUser,
    validateLoginUser,
    validateUserExists,
    validateUpdateUserByAdmin,
    validateUpdateUserByUser
}
