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
        [order.userId, order.productId, order.quantity, order.totalPrice], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function getTrainers() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM trainers', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })   
}

function getTrainerById(trainerId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM trainers WHERE id = ?', [trainerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })    
}

function insertComment(comment) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO trainer_comments (fk_user_id , trainer_id , comment) VALUES (?, ?, ?)',
        [comment.userId, comment.trainerId, comment.comment], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function getRatingByUserAndTrainerIds(userId, trainerId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM trainer_ratings WHERE fk_user_id = ? AND trainer_id = ?',
        [userId, trainerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })    
}

function insertRating(rating) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO trainer_ratings (fk_user_id , trainer_id , rating) VALUES (?, ?, ?)',
        [rating.userId, rating.trainerId, rating.rating], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function updateRating(rating) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE trainer_ratings SET rating=? WHERE fk_user_id = ? AND trainer_id = ?',
        [rating.rating, rating.userId, rating.trainerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

const dbOperations = { 
    getUsers, getUserByUserEmail, getUserByUserId, insertUser, deleteUser, updateUser,
    getProducts, getProductById, insertProduct, deleteProduct, updateProduct,
    getOrdersByUserId, insertOrder,
    getTrainers, getTrainerById,
    insertComment,
    getRatingByUserAndTrainerIds, insertRating, updateRating
 }

module.exports = dbOperations