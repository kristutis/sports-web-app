require('dotenv').config();
const express = require('express')

const app = express()
const PORT = process.env.PORT || 8000;
app.use(express.json())

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

app.listen(PORT, () => {
    console.log('Server is running! Listening on PORT: ' + PORT);
});