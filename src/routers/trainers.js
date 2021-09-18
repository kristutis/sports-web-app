const express = require('express');

const router = new express.Router();

const trainers = [
    {
        id: 1,
        name: 'Treneris 1',
        surname: 'Treneriauskas',
        price: 55.55,
        description: 'Labai geras treneris',
        moto: 'Sportas - sveikata!',
    },
    {
        id: 2,
        name: 'Treneris 2',
        surname: '',
        price: 66.66,
        description: 'Labai blogas treneris',
        moto: 'Man patinka sportuoti!',
    },
]

router.get('/trainers', (req, res) => {
    res.json(trainers)
})



module.exports = router;