const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid
  let place
  try {
    place = await Place.findById(placeId)
  } catch (error) {
    return next(new HttpError('Something went wrong', 500))
  }
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id', 404)
    )
  }
  res.status(200).json({ place: place.toObject({ getters: true }) })
}

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid
  let places
  try {
    places = await Place.find({ creator: userId })
  } catch (error) {
    return next(new HttpError('Something went wrong', 500))
  }

  if (!places || !places.length) {
    return next(
      new HttpError('Could not find a place for the provided user id', 404)
    )
  }

  res
    .status(200)
    .json({ places: places.map(place => place.toObject({ getters: true })) })
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
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      'https://aws-tiqets-cdn.imgix.net/images/content/1e74453a4d2c45f9becb39add27f2dff.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=25&s=b720cbf5ab86e1786ee7bd2a6b4f26be&w=400&h=320&dpr=2.625',
    creator,
  })
  try {
    await createdPlace.save()
  } catch (error) {
    return next(new HttpError('Creating place failed', 500))
  }
  res.status(201).json(createdPlace)
}

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    )
  }
  const placeId = req.params.pid
  const { title, description } = req.body
  let place
  try {
    place = await Place.findById(placeId)
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find the place.', 500)
    )
  }

  if (!place) {
    return next(
      new HttpError('Could not find the place for the specified id', 404)
    )
  }
  place.title = title
  place.description = description
  try {
    await place.save()
  } catch (error) {
    return next(new HttpError('Something went wrong', 500))
  }
  res.status(200).json({ place: place.toObject({ getters: true }) })
}

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid
  try {
    await Place.findByIdAndRemove(placeId)
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not delete place.', 500)
    )
  }

  res.status(200).json({ message: 'Deleted place' })
}
