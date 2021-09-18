const express = require('express');
const jwt = require('jsonwebtoken')

const router = new express.Router();

const posts = [
    {
        username: 'Kyle',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }
]

router.get('/posts', authenticateToken, (req, res) => {
    // req.user //get user
    console.log(req.user.name)
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401)   
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403) //token no longer valid
        }
        req.user = user
        next()
    })
}

module.exports = router;