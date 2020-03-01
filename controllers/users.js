const { v4: uuid } = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')

const DUMMY_USERS = [
  { id: 'u1', name: 'test name', email: 'some email', password: 'test' },
  { id: 'u2', name: 'test name', email: 'another email', password: 'test' },
]

exports.getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS })
}

exports.signup = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    throw new HttpError('Invalid inputs passed, please check your data', 422)
  }

  const { name, email, password } = req.body

  const hasUser = DUMMY_USERS.find(user => user.email === email)
  if (hasUser) {
    throw new HttpError('User already exists', 422)
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  }
  DUMMY_USERS.push(createdUser)
  res.status(201).json({ user: createdUser })
}

exports.login = (req, res, next) => {
  const { email, password } = req.body
  const identifiedUser = DUMMY_USERS.find(user => user.email === email)
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      'Could not identify user, credentials seem to be wrong',
      401
    )
  }
  res.json({ token: 'some dummy token' })
}
