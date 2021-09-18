const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../config/.env')})
const express = require('express')

const app = express()
const PORT = process.env.PORT || 8000;

const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')

app.use(express.json())
app.use(usersRouter)
app.use(postsRouter)

app.listen(PORT, () => {
    console.log('Server is up! Listening PORT: ' + PORT);
});