const express = require('express');
const { generateAccessToken} = require('../middleware/authentication');

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

router.post('/users/signup', (req, res) => {
    //authentication

    const username = req.body.username

    const user = {
        name: username
    }
    console.log(user)

    const accessToken = generateAccessToken(user)

    res.json({accessToken: accessToken})
})

router.post('/users/login', (req, res) => {
    //authentication

    const username = req.body.username

    const user = {
        name: username
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