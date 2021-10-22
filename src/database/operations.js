const db = require('./config/config')

function getUserByUserId(id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id, name, surname, email, reg_date, modify_date, money, role FROM users WHERE id = ?`, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0])
        })
    })
}

function getUserByEmail(userEmail) {
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
        db.query('SELECT id, name, surname, email, reg_date, modify_date, money, role FROM users', (err, results) => {
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
        db.query('UPDATE users SET name=?, surname=?, email=?, money=?, role=? WHERE id = ?',
        [user.name, user.surname, user.email, user.money, user.role, user.id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function updateUserPassword(passwordDetails) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE users SET password=? WHERE id = ?',
        [passwordDetails.password, passwordDetails.id], (err, results) => {
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

function insertTrainer(trainer) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO trainers (name, surname, price, description, moto) VALUES (?, ?, ?, ?, ?)',
            [trainer.name, trainer.surname, trainer.price, trainer.description, trainer.moto], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

function updateTrainer(trainer) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE trainers SET name=?, surname=?, price=?, description=?, moto=? WHERE id = ?',
        [trainer.name, trainer.surname, trainer.price, trainer.description, trainer.moto, trainer.id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function deleteTrainer(id) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM trainers WHERE id = ?', [id], (err, results) => {
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

function getCommentsByTrainerId(trainerId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM trainer_comments WHERE trainer_id = ?', [trainerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function getCommentByCommentId(commentId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM trainer_comments WHERE id = ?', [commentId], (err, results) => {
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

function deleteComment(commentId) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM trainer_comments WHERE id = ?',
        [commentId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function updateComment(comment, commentId) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE trainer_comments SET comment=? WHERE id = ?',
        [comment, commentId], (err, results) => {
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

function getRatings() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM trainer_ratings', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })    
}

function getRatingsByTrainerId(trainerId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM trainer_ratings WHERE trainer_id = ?', [trainerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
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

function deleteRating(userId, trainerId) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM trainer_ratings WHERE fk_user_id = ? AND trainer_id = ?',
        [userId, trainerId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

const dbOperations = { 
    getUsers, getUserByEmail, getUserByUserId, insertUser, deleteUser, updateUser, updateUserPassword,
    getProducts, getProductById, insertProduct, deleteProduct, updateProduct,
    getOrdersByUserId, insertOrder,
    getTrainers, getTrainerById, insertTrainer, updateTrainer, deleteTrainer,
    getCommentByCommentId, insertComment, getCommentsByTrainerId, deleteComment, updateComment,
    getRatings, getRatingByUserAndTrainerIds, getRatingsByTrainerId, insertRating, updateRating, deleteRating
 }

module.exports = dbOperations