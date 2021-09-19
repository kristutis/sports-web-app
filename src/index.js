//pervadint pathus i /api/
require('dotenv').config();
const express = require('express')

const app = express()
const PORT = process.env.PORT || 8000;

const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')
const trainersRouter = require('./routers/trainers')
const reservationsRouter = require('./routers/reservations')

app.use(express.json())
app.use(usersRouter)
app.use(postsRouter)
app.use(trainersRouter)
app.use(reservationsRouter)

app.get('/', (req, res) => {
    res.send('Welcome to sports-web API!')
})

app.listen(PORT, () => {
    console.log('Server is running! Listening on PORT: ' + PORT);
});