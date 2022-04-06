const jwt = require('koa-jwt')

module.exports = (...args) => {
    return new Promise((resolve, reject) => {
        jwt.verify(...args, (err, decoded) => {
            err ? reject(err) : resolve(decoded)
        })
    })
}