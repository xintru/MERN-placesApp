const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places')
const usersRoutes = require('./routes/users')
const { MONGODB_PATH } = require('./secrets/secrets')

const app = express()

app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

// app.use((req, res, next) => {
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   )
// })

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404)
})

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, error => {
      console.log(error)
    })
  }
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
