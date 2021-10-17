const jwt = require('jsonwebtoken');

const ADMIN_ROLE = 255
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || '15m'
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '60m'
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ''
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw Error('Access token secret not found!')
}

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE })
}

function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE })
}

function authenticateRefreshToken(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken
        if (!refreshToken) {
            return res.status(400).send('No token recieved')
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send('Refresh token no longer valid')
            }
            req.user = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                password: user.password,
                money: user.money,
                role: user.role,
            }
            next()
        })
    } catch(e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            return res.sendStatus(401)   
        }
        const token = authHeader.replace('Bearer', '').trim();
        if (!token) {
            return res.sendStatus(401)   
        }

        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403) //token no longer valid 
            }
            req.user = user
            next()
        })
    } catch {
        return res.sendStatus(403)
    }
}

function authenticateAdmin(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            return res.sendStatus(401)   
        }
        const token = authHeader.replace('Bearer', '').trim();
        if (token == null) {
            return res.sendStatus(401)   
        }

        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403) //token no longer valid 
            }
            if (ADMIN_ROLE == user.role) {
                req.user = user
                next()
            } else {
                return res.sendStatus(403)
            }
        })
    } catch {
        return res.sendStatus(500)
    }
}

module.exports = {
    ADMIN_ROLE,
    generateAccessToken, generateRefreshToken,
    authenticateUser, authenticateAdmin, authenticateRefreshToken
}