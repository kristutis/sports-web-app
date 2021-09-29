const mysql = require('mysql')

var config = {
    connectionLimit: 10,
    password: 'sports-db-pass-1',
    user: 'sports-db',
    database: 'sports_db',
}

if (process.env.DB_INSTANCE_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = process.env.DB_INSTANCE_NAME
} else if (process.env.DB_HOST) {
    config.host = process.env.DB_HOST
} else {
    throw 'CANNOT CONNECT TO DB!';
}

const db = mysql.createPool(config)

module.exports = db