const express = require('express');
const dbOperations = require('../database/operations');
const { authenticateUser } = require('../middleware/authentication');

const router = new express.Router();

router.get('/api/trainer/:tid/comments', async (req, res) => {
    const trainerId = req.params.tid

    try {
        const result = await dbOperations.getCommentsByTrainerId(trainerId)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }    
})

// router.get('/api/products', async (req, res) => {
//     try {
//         results = await dbOperations.getProducts()
//         res.json(results).send()
//     } catch (e) {
//         console.log(e)
//         res.sendStatus(500)
//     }
// })

// router.get('/api/products/:id', async (req, res) => {
//     const productId = req.params.id
//     try {
//         results = await dbOperations.getProductById(productId)
//         res.json(results).send()
//     } catch (e) {
//         console.log(e)
//         res.sendStatus(500)
//     }
// })

router.post('/api/trainer/comments', authenticateUser, async (req, res) => {
    const userId = req.user.id
    const trainerId = req.body.trainerId
    const comment = req.body.comment

    const commentObject = {
        userId: userId,
        trainerId: trainerId,
        comment: comment
    }

    try {
        const trainer = await dbOperations.getTrainerById(trainerId)
        if (!trainer) {
            return res.status(400).json({error: 'trainer does not exist'}).send()
        }

        await dbOperations.insertComment(commentObject)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// router.put('/api/products', authenticateAdmin, async (req, res) => {
//     const product = {
//         id: req.body.id,
//         name: req.body.name,
//         description: req.body.description,
//         price: req.body.price,
//         quantity: req.body.quantity,
//     }
//     try {
//         await dbOperations.updateProduct(product)
//         res.sendStatus(200)
//     } catch (e) {
//         console.log(e)
//         res.sendStatus(500)
//     }
// })

// router.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
//     const productId = req.params.id
//     try {
//         await dbOperations.deleteProduct(productId)
//         res.sendStatus(200)
//     } catch (e) {
//         console.log(e)
//         res.sendStatus(500)
//     }
// })

module.exports = router;