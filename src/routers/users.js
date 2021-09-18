const express = require('express');
const { generateAccessToken} = require('../middleware/authentication');
const bcrypt = require('bcrypt')

const router = new express.Router();

const users = [
    {
        id: 1,
        name: 'NAME_1',
        surname: 'SURNAME_1',
        email: 'email@em.com',
        password: 'asdfd',
        money: 100.5,
        role: 1
    },
    {
        id: 2,
        name: 'NAME_2',
        surname: 'SURNAME_2',
        email: 'email@yandex.ru',
        password: 'asdfd',
        money: 100.55,
        role: 1
    },
    {
        id:100,
        name: 'ADMIN',
        surname: 'ADMIN_S',
        email: 'email@admin.ru',
        password: 'asdfd',
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

    console.log(user)

    const accessToken = generateAccessToken(user)

    res.json({accessToken: accessToken})
})

router.get('/users', (req, res) => {
    //tik adminui

    res.json(users)
})

module.exports = router