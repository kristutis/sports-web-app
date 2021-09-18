const express = require('express');
const { generateAccessToken} = require('../middleware/authentication');

const router = new express.Router();



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

module.exports = router