const express = require('express');

const router = new express.Router();

const trainers = [
    {
        id: 1,
        name: 'Treneris 1',
        surname: 'Petrauskas',
        price: 55.55,
        description: 'Labai geras treneris',
        moto: 'Sportas - sveikata!',
    },
    {
        id: 2,
        name: 'Treneris 2',
        surname: 'Jonauskas',
        price: 66.66,
        description: 'Labai blogas treneris',
        moto: 'Man patinka sportuoti!',
    },
]

router.get('/trainers', (req, res) => {
    res.json(trainers)
})

router.get('/trainers/:id', (req, res) => {
    let trainerId = req.params.id
    let trainer = trainers.filter(t => t.id == trainerId)
    res.json(trainer)
})


module.exports = router;