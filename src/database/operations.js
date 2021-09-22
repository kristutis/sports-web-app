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

function getProductById(id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function insertProduct(product) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)',
            [product.name, product.description, product.price, product.quantity], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

const dbOperations = { getUsers, getUserByUserId, getProducts, getProductById, insertProduct, deleteProduct }

module.exports = dbOperations