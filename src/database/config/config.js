const mysql = require('mysql')

var config = {}

if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD) {    
    config.connectionLimit = 10
    config.database = process.env.DB_NAME
    config.user = process.env.DB_USER
    config.password = process.env.DB_PASSWORD
} else {
    throw 'db name, user or pass does not exist';
}

if (process.env.DB_INSTANCE_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = process.env.DB_INSTANCE_NAME
} else if (process.env.DB_HOST) {
    config.host = process.env.DB_HOST
} else {
    throw 'db host or connection string does not exist';
}

const db = mysql.createPool(config)

module.exports = db