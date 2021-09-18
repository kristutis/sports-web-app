const express = require('express');
const jwt = require('jsonwebtoken')

const router = new express.Router();

const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '30m'

router.post('/login', (req, res) => {
    //authentication

    const username = req.body.username

    const user = {
        name: username
    }
    console.log(user)

    const accessToken = generateAccessToken(user)

    res.json({accessToken: accessToken})
})

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE })
}

module.exports = router