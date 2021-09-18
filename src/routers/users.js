const express = require('express');
const { authenticateToken, generateAccessToken } = require('../middleware/authentication');
const bcrypt = require('bcrypt')

const router = new express.Router();

const ADMIN_ROLE = 255

const users = [
    {
        id: 1,
        name: 'Kyle',
        surname: 'SURNAME_1',
        email: 'email@em.com',
        password: 'asdfd',
        money: 100.5,
        role: 1
    },
    {
        id: 2,
        name: 'Jim',
        surname: 'SURNAME_2',
        email: 'email@yandex.ru',
        password: 'asdfd',
        money: 100.55,
        role: 1
    },
    {
        id: 255,
        name: 'ADMIN',
        surname: 'ADMIN_S',
        email: 'admin',
        password: '$2b$10$6HOTs2ZZMHP4TqEeBxIS9Oa2re10bEI7IVm1jOws6m6g/1RBYZs7u',
        money: 999.99,
        role: 255
    }
]

router.post('/users/signup', async (req, res) => {
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
        users.push(newUser)
        res.status(201).send('user ' + userDetails.name + ' created')
    } catch {
        res.status(500).json({error: 'error when creating a user'}).send()
    }
})

router.post('/users/login', async (req, res) => {
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

    res.json({accessToken: accessToken})
})

router.get('/users', authenticateToken, (req, res) => {
    const userRole = req.user.role
    if (ADMIN_ROLE === userRole) {
        res.json(users)
    }
    res.status(403).send()
})

module.exports = router