const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places')
const usersRoutes = require('./routes/users')
const { MONGODB_PATH } = require('./secrets/secrets')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'Something went wrong.' })
})

mongoose
  .connect(MONGODB_PATH, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(5000))
  .catch(error => console.log(error))
