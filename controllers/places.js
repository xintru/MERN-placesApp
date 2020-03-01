const { v4: uuid } = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')

let DUMMY_PLACES = [
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

exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find(place => place.id === placeId)
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided user id', 404)
    )
  }
  res.status(200).json(place)
}

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid
  const places = DUMMY_PLACES.filter(place => place.creator === userId)

  if (!places || !places.length) {
    return next(
      new HttpError('Could not find a place for the provided user id', 404)
    )
  }

  res.status(200).json(places)
}

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    )
  }
  const { title, description, address, creator } = req.body
  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  }
  DUMMY_PLACES.unshift(createdPlace)

  res.status(201).json(createdPlace)
}

exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data', 422)
  }
  const placeId = req.params.pid
  const { title, description } = req.body
  const newPlace = {
    title,
    description,
  }
  const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace
  res.status(200).json({ place: updatedPlace })
}

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  if (!DUMMY_PLACES.find(place => place.id === placeId)) {
    throw new HttpError('Could not find a place that you want to delete', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId)
  res.status(200).json({ message: 'Deleted place' })
}
