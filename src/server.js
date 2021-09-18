const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../config/.env')})
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '10m'
const PORT = process.env.PORT || 8000;
ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
if (!ACCESS_TOKEN_SECRET) {
    throw Error('Access token secret not found!')
}

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

// app.delete('/logout', (req, res) => {
//     jwt.
// })

app.post('/login', (req, res) => {
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

function authenticateToken(req, res, next) {
    //generate new token
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

app.listen(PORT, () => {
    console.log('Server is up! Listening PORT: ' + PORT);
});