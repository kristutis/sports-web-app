const express = require('express');
const { authenticateRefreshToken, authenticateAdmin, generateAccessToken, generateRefreshToken, authenticateUser, ADMIN_ROLE } = require('../middleware/authentication');
const bcrypt = require('bcrypt')
const dbOperations = require('../database/operations');
const { validateCreateUser, validateLoginUser, validateUserExists, validateUpdateUserByAdmin, validateUpdateUserByUser } = require('../middleware/users');
const { validateId } = require('../middleware/common');

const router = new express.Router();
const TOKEN_TYPE = 'Bearer'

let refreshTokens = []

router.post('/api/users/signup', validateCreateUser, async (req, res) => {
    const userDetails = req.userDetails
    try {
        const hashedPassword = await bcrypt.hash(userDetails.password, 10)
        const newUser = {
            name: userDetails.name,
            surname: userDetails.surname,
            email: userDetails.email,
            password: hashedPassword,
        }
        await dbOperations.insertUser(newUser)
        res.status(201).send('user ' + userDetails.name + ' created')
    } catch (e) {
        if (e.sqlMessage && e.sqlMessage.includes('Duplicate entry')) {
            return res.status(400).json({error: 'User already exists'})
        }     
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/api/users/login', validateLoginUser, async (req, res) => {
    const loginUserDetails = req.userDetails

    const user = await dbOperations.getUserByEmail(loginUserDetails.email)
    if (!user) {
        return res.status(404).json({error: 'User does not exist'})
    }

    try {
        const passwordsMatch = await bcrypt.compare(loginUserDetails.password, user.password)
        if (!passwordsMatch) {
            return res.status(400).json({error: 'Incorrect password'})
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }

    const validUser = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        reg_date: user.reg_date,
        modify_date: user.modify_date,
        money: user.money,
        role: user.role
    }

    const accessToken = generateAccessToken(validUser)
    const refreshToken = generateRefreshToken(validUser)
    refreshTokens.push(refreshToken)

    res.json({
        tokenType: TOKEN_TYPE,
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

router.delete('/api/users/logout', authenticateRefreshToken, (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshTokens.includes(refreshToken)) {
        refreshTokens = refreshTokens.filter(token => token !== refreshToken)
        return res.sendStatus(200)
    } else {
        return res.sendStatus(404)
    }
})

router.post('/api/users/refresh', authenticateRefreshToken, (req, res) => {
    const user = req.user
    const refreshToken = req.body.refreshToken

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(404).send()
    }

    const accessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    refreshTokens = refreshTokens.filter(token => token !== refreshToken)    
    refreshTokens.push(newRefreshToken)

    res.json({
        tokenType: TOKEN_TYPE,
        accessToken: accessToken,
        refreshToken: newRefreshToken
    })
})

router.get('/api/users', authenticateAdmin, async (req, res) => {
    try {
        results = await dbOperations.getUsers()
        res.json(results)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/api/users/details', 
    [
        authenticateUser
    ], async (req, res) => {
    userId = req.user.id
    try {
        const user = await dbOperations.getUserByUserId(userId)
        if (!user) {
            return res.status(404).send('User does not exist')
        }
        return res.status(200).json(user)
    } catch (e) {
        console.log(e)
        return  res.sendStatus(500)
    }
})

router.get('/api/users/:id', 
    [
        validateId,
        authenticateAdmin
    ], async (req, res) => {
    userId = req.params.id
    try {
        const user = await dbOperations.getUserByUserId(userId)
        if (!user) {
            return res.status(404).send('User does not exist')
        }
        return res.status(200).json(user)
    } catch (e) {
        console.log(e)
        return  res.sendStatus(500)
    }
})

router.delete('/api/users/:id', 
    [
        validateId,
        authenticateAdmin,
        validateUserExists
    ], async (req, res) => {
    userId = req.params.id
    try {
        await dbOperations.deleteUser(userId)
        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.put('/api/users/:id', 
    [
        validateId,
        validateUserExists,
        authenticateAdmin,
        validateUpdateUserByAdmin
    ], async (req, res) => {
    const userId = req.params.id
    const userDetails = req.userDetails

    const updatedUserDetails = {
        id: userId,
        name: userDetails.name,
        surname: userDetails.surname,
        email: userDetails.email,
        money: userDetails.money,
        role: userDetails.role
    }
    try {
        await dbOperations.updateUser(updatedUserDetails)
    } catch (e) {
        if (e.sqlMessage && e.sqlMessage.includes('Duplicate entry')) {
            return res.status(400).json({error: 'Email already exists'})
        }
        console.log(e)
        res.sendStatus(500)
    }

    if (userDetails.password) {
        try {
            const hashedPassword = await bcrypt.hash(userDetails.password, 10)
            const passwordDetails = {
                id: userId,
                password: hashedPassword,
            }
            await dbOperations.updateUserPassword(passwordDetails)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
    res.sendStatus(200)
})

router.put('/api/users',
    [
        authenticateUser,
        validateUpdateUserByUser
    ], async (req, res) => {
    const currentUser = req.user
    const updatedUserDetails = req.userDetails

    const newUserDetails = {
        id: currentUser.id,
        name: updatedUserDetails.name,
        surname: updatedUserDetails.surname,
        email: updatedUserDetails.email,
        money: currentUser.money,
        role: currentUser.role
    }
    try {
        await dbOperations.updateUser(newUserDetails)
    } catch (e) {
        if (e.sqlMessage && e.sqlMessage.con) {

        }
        if (e.sqlMessage && e.sqlMessage.includes('Duplicate entry')) {
            return res.status(400).json({error: 'Email already exists'})
        }
        return res.sendStatus(500)
    }

    if (updatedUserDetails.password) {
        try {
            const hashedPassword = await bcrypt.hash(updatedUserDetails.password, 10)
            const passwordDetails = {
                id: currentUser.id,
                password: hashedPassword,
            }
            await dbOperations.updateUserPassword(passwordDetails)
        } catch (e) {
            if (e.sqlMessage && e.sqlMessage.includes('Duplicate entry')) {
                return res.status(400).json({error: 'Try another password'})
            }
            console.log(e)
            return res.sendStatus(500)
        }
    }
    res.sendStatus(200)
})

module.exports = router