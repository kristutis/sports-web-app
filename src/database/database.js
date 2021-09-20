const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'sports-db',
    host: 'localhost',
    port: '3306'
}) 

const sportsDb = {}

sportsDb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users`, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

sportsDb.getUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users where id = ?`, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

module.exports = sportsDb