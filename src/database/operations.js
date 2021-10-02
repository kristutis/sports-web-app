const db = require('./config/config')

function getUserByUserId(id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })
}

function getUserByUserEmail(userEmail) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users WHERE email = ?`, [userEmail], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
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

function insertUser(user) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [user.name, user.surname, user.email, user.password], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function updateUser() {

}

function deleteUser(id) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
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

function updateProduct(product) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE products SET name=?, description=?, price=?, quantity=? WHERE id = ?',
        [product.name, product.description, product.price, product.quantity, product.id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

const dbOperations = { 
    getUsers, getUserByUserEmail, getUserByUserId, insertUser, deleteUser,
    getProducts, getProductById, insertProduct, deleteProduct, updateProduct
 }

module.exports = dbOperations