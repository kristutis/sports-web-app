const express = require('express');
const { authenticateToken } = require('../middleware/authentication');

const router = new express.Router();

const reservations = [
    {
        gymTimeId: 5,
        userId: 1
    },
    {
        gymTimeId: 10,
        userId: 2
    }
]

router.get('/reservations', authenticateToken, (req, res) => {
    // console.log(req.user.name)

    // res.json(posts.filter(post => post.username === req.user.name))
})

router.delete('/reservations', authenticateToken, (req, res) => {
    // // req.user //get user
    // console.log(req.user.name)
    // res.json(posts.filter(post => post.username === req.user.name)
})



module.exports = router;