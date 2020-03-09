const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const { JWT_PRIVATE_KEY } = require('../secrets/secrets')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      throw new Error('Authentication failed!')
    }
    const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY)
    req.userData = {
      userId: decodedToken.userId,
    }
    next()
  } catch (error) {
    return next(new HttpError('Authentication failed!', 403))
  }
}
