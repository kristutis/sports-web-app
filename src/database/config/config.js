const mysql = require('mysql')

const db = mysql.createPool({
    connectionLimit: 10,
    password: 'sports-db-pass-1',
    user: 'sports-db',
    database: 'sports_db',
    host: '34.88.169.216',
    port: '3306'
})

module.exports = db