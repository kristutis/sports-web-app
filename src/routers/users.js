const express = require('express');
const { authenticateRefreshToken, authenticateAdmin, generateAccessToken, generateRefreshToken } = require('../middleware/authentication');
const bcrypt = require('bcrypt')
const dbOperations = require('../database/operations');

const router = new express.Router();

let refreshTokens = []

let users = [
    {
        id: 1,
        name: 'Kyle',
        surname: 'SURNAME_1',
        email: 'email@em.com',
        password: 'asdfd',
        money: 100.5,
        role: 1,
    },
    {
        id: 2,
        name: 'Jim',
        surname: 'SURNAME_2',
        email: 'email@yandex.ru',
        password: 'asdfd',
        money: 100.55,
        role: 1,
    },
    {
        id: 200,
        name: 'ADMIN',
        surname: 'ADMIN_S',
        email: 'admin',
        password: '$2b$10$6HOTs2ZZMHP4TqEeBxIS9Oa2re10bEI7IVm1jOws6m6g/1RBYZs7u',
        money: 999.99,
        role: 255,
    }
]

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
            id: users.length, //change
            name: userDetails.name,
            surname: userDetails.surname,
            email: userDetails.email,
            password: hashedPassword,
        }
        users.push(newUser)
        res.status(201).send('user ' + userDetails.name + ' created')
    } catch {
        res.status(500).json({error: 'error when creating a user'})
    }
})

router.post('/api/users/login', async (req, res) => {
    const email = req.body.email 
    const password = req.body.password
    const user = users.find(user => user.email === email)
    if (user == null) {
        return res.status(400).json({error: 'Cannot find user'}).send()
    }
    try {
        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) {
            return res.status(400).json({error: 'Incorrect password'})
        }
    } catch {
        return res.status(500).json({error: 'Cannot dehash password'})
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    refreshTokens.push(refreshToken)
    
    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

router.delete('/api/users/logout', (req, res) => {
    const refreshToken = req.body.refreshToken
    refreshTokens = refreshTokens.filter(token => token !== refreshToken)
    res.sendStatus(204)
})

router.post('/api/users/token', authenticateRefreshToken, (req, res) => {
    const user = req.user
    const refreshToken = req.body.refreshToken

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).send()
    }

    const accessToken = generateAccessToken(user)
    res.json({
        accessToken: accessToken
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

router.delete('/api/users/:id', authenticateAdmin, (req, res) => {
    userId = req.params.id
    const userExist = users.find(user => user.id == userId)
    if (!userExist) {
        return res.status(400).json({error: "User does not exist"})
    }

    const oldCount = users.length
    users = users.filter(user => user.id != userId)
    if(users.length < oldCount) {
        return res.status(200).send()
    }
    res.status(500).send()
})

module.exports = router