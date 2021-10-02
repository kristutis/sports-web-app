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

function updateUser(user) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE users SET name=?, surname=?, email=?, password=?, money=?, role=? WHERE id = ?',
        [user.name, user.surname, user.email, user.password, user.money, user.role, user.id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
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
            return resolve(results[0])
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

function getOrdersByUserId(userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orders WHERE fk_user_id = ?', [userId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function insertOrder(order) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO orders (fk_user_id, fk_product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
        [order.userId, order.productId, order.quantity, order.totalPrice,], (err, results) => {
            if (err) {
                console.log('asd')
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

const dbOperations = { 
    getUsers, getUserByUserEmail, getUserByUserId, insertUser, deleteUser, updateUser,
    getProducts, getProductById, insertProduct, deleteProduct, updateProduct,
    getOrdersByUserId, insertOrder
 }

module.exports = dbOperations