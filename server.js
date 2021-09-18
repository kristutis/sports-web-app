require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

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

app.get('/posts', authenticateToken, (req, res) => {
    // req.user //get user
    console.log(req.user.name)
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    //authentication

    const username = req.body.username

    const user = {
        name: username
    }
    console.log(user)

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401)   
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403) //token no longer valid
        }
        req.user = user
        next()
    })
}

app.listen(3000); 