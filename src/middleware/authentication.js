const jwt = require('jsonwebtoken');

const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '30m'
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
if (!ACCESS_TOKEN_SECRET) {
    throw Error('Access token secret not found!')
}

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader.replace('Bearer', '').trim();
    if (token == null) {
        return res.sendStatus(401)   
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403) //token no longer valid
        }
        req.user = user
        next()
    })
}

module.exports = { generateAccessToken, authenticateToken }