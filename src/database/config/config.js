const mysql = require('mysql')

const db = mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'sports-db',
    host: 'localhost',
    port: '3306'
})

module.exports = db