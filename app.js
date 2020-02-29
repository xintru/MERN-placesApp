const express = require('express')
const bodyParser = require('body-parser')
const placesRoutes = require('./routes/places')
const usersRoutes = require('./routes/users')

const app = express()

// app.use(bodyParser.urlencoded)

app.use('/api/places', placesRoutes)
// app.use(users)

app.use((error, res, req, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'Something went wrong.' })
})

app.listen(5000)
