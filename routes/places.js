const express = require('express')

const HttpError = require('../models/http-error')

const router = express.Router()

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'Some description',
    imageUrl:
      'https://aws-tiqets-cdn.imgix.net/images/content/1e74453a4d2c45f9becb39add27f2dff.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=25&s=b720cbf5ab86e1786ee7bd2a6b4f26be&w=400&h=320&dpr=2.625',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u1',
  },
]

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find(place => place.id === placeId)
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided user id', 404)
    )
  }
  res.status(200).json(place)
})

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid
  const place = DUMMY_PLACES.find(place => place.creator === userId)

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided user id', 404)
    )
  }

  res.status(200).json(place)
})

module.exports = router
