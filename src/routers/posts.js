const express = require('express');
const { authenticateUser } = require('../middleware/authentication');

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

router.get('/api/posts', authenticateUser, (req, res) => {
    // req.user //get user
    console.log(req.user.name)
    res.json(posts.filter(post => post.username === req.user.name))
})



module.exports = router;