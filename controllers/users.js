const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')

exports.getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  } catch (error) {
    return next(new HttpError('Error fetching users', 500))
  }
  res
    .status(200)
    .json({ users: users.map(user => user.toObject({ getters: true })) })
}

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    )
  }

  const { name, email, password } = req.body
  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (error) {
    return next(new HttpError('Something went wrong', 500))
  }
  if (existingUser) {
    return next(new HttpError('User already exists', 422))
  }
  const createdUser = new User({
    name,
    email,
    image:
      'https://aws-tiqets-cdn.imgix.net/images/content/1e74453a4d2c45f9becb39add27f2dff.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=25&s=b720cbf5ab86e1786ee7bd2a6b4f26be&w=400&h=320&dpr=2.625',
    password,
    places: [],
  })
  try {
    await createdUser.save()
  } catch (error) {
    return next(new HttpError('Signing up failed', 500))
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body
  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (error) {
    return next(new HttpError('Logging in failed', 404))
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        'Could not identify user, credentials seem to be wrong',
        401
      )
    )
  }
  res.json({ user: existingUser.toObject({ getters: true }) })
}
