const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../config/.env')})
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 8000;
ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
if (!ACCESS_TOKEN_SECRET) {
    throw Error('Access token secret not found!')
}

const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')

app.use(express.json())
app.use(usersRouter)
app.use(postsRouter)

app.listen(PORT, () => {
    console.log('Server is up! Listening PORT: ' + PORT);
});