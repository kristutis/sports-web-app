//error handling middleware
const cors = require('cors');
require('dotenv').config();
const express = require('express')

const app = express()
const PORT = process.env.PORT || 8000;
app.use(express.json())
app.use(cors());
app.options('*', cors());

const usersRouter = require('./routers/users')
const trainersRouter = require('./routers/trainers')
const productsRouter = require('./routers/products')
const ordersRouter = require('./routers/orders')
const trainerCommentsRouter = require('./routers/trainerComments')
const trainerRatingsRouter = require('./routers/trainerRatings')

app.use(usersRouter)
app.use(trainersRouter)
app.use(productsRouter)
app.use(ordersRouter)
app.use(trainerCommentsRouter)
app.use(trainerRatingsRouter)

app.get('/', (req, res) => {
    res.send('Welcome to sports-web API!')
})

app.all('*', (req, res) => {
    res.sendStatus(404);
})

app.use((error, req, res, next) => {
    if (error) {
        if (error instanceof SyntaxError) {
            return res.status(400).send('Bad syntax')
        } else {
            console.log(error)
            // return res.sendStatus(500)
        }
    }
    next()
})

app.listen(PORT, () => {
    console.log('Server is running! Listening on PORT: ' + PORT);
});