const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const { JWT_PRIVATE_KEY } = require('../secrets/secrets')
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

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (error) {
    next(new HttpError('Could not create user, please try again.', 500))
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  })
  try {
    await createdUser.save()
  } catch (error) {
    return next(new HttpError('Signing up failed', 500))
  }

  let token
  try {
    token = await jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_PRIVATE_KEY,
      { expiresIn: '1h' }
    )
  } catch (error) {
    return next(new HttpError('Signing up failed', 500))
  }

  res
    .status(201)
    .json({ user: createdUser.id, email: createdUser.email, token })
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body
  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (error) {
    return next(new HttpError('Logging in failed', 404))
  }

  if (!existingUser) {
    return next(new HttpError('Invalid email and/or password.', 403))
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (error) {
    return next(new HttpError('Something went wrong', 500))
  }
  if (!isValidPassword) {
    return next(new HttpError('Invalid email and/or password.', 403))
  }

  let token
  try {
    token = await jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_PRIVATE_KEY,
      { expiresIn: '1h' }
    )
  } catch (error) {
    return next(new HttpError('Logging in failed', 500))
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token })
}
