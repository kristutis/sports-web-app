const db = require('./config/config')

function getUserByUserId(id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

function getUsers() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function getProducts() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

const dbOperations = { getUsers, getUserByUserId, getProducts }

module.exports = dbOperations