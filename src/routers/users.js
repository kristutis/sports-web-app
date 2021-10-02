const express = require('express');
const { authenticateRefreshToken, authenticateAdmin, generateAccessToken, generateRefreshToken } = require('../middleware/authentication');
const bcrypt = require('bcrypt')
const dbOperations = require('../database/operations');

const router = new express.Router();
const TOKEN_TYPE = 'Bearer'

let refreshTokens = []

router.post('/api/users/signup', async (req, res) => {
    const userDetails = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
    }

    try {
        const hashedPassword = await bcrypt.hash(userDetails.password, 10)
        const newUser = {
            name: userDetails.name,
            surname: userDetails.surname,
            email: userDetails.email,
            password: hashedPassword,
        }
        try {
            await dbOperations.insertUser(newUser)
        } catch (e) {
            if (e.sqlMessage.includes('Duplicate entry')) {
                return res.status(400).json({error: 'User already exists'})
            }
        }
        res.status(201).json('user ' + userDetails.name + ' created')
    } catch (e) {        
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/api/users/login', async (req, res) => {
    const email = req.body.email 
    const password = req.body.password
    const user = await dbOperations.getUserByUserEmail(email)
    if (!user) {
        return res.status(400).json({error: 'User does not exist'})
    }
    try {
        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) {
            return res.status(400).json({error: 'Incorrect password'})
        }
    } catch {
        console.log('Cannot dehash password')
        return res.sendStatus(500)
    }

    const validUser = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: user.password,
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

router.delete('/api/users/logout', (req, res) => {
    const refreshToken = req.body.refreshToken
    refreshTokens = refreshTokens.filter(token => token !== refreshToken)
    res.sendStatus(200)
})

router.post('/api/users/refresh', authenticateRefreshToken, (req, res) => {
    const user = req.user
    const refreshToken = req.body.refreshToken

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).send()
    }

    const accessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    refreshTokens = refreshTokens.filter(token => token !== refreshToken)    
    refreshTokens.push(newRefreshToken)

    res.json({
        tokenType: TOKEN_TYPE,
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

router.get('/api/users', authenticateAdmin, async (req, res) => {
    try {
        results = await dbOperations.getUsers()
        res.json(results).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/api/users/:id', authenticateAdmin, async (req, res) => {
    userId = req.params.id
    try {
        const user = await dbOperations.getUserByUserId(userId)
        if (!user) {
            return res.status(400).json({error: "User does not exist"})
        }
        res.status(200).json(user).send()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/api/users/:id', authenticateAdmin, async (req, res) => {
    userId = req.params.id

    try {
        const user = await dbOperations.getUserByUserId(userId)
        const userExist = !!user && user.id == userId
        if (!userExist) {
            return res.status(400).json({error: "User does not exist"})
        }
        await dbOperations.deleteUser(user.id)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router