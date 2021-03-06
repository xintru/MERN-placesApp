const mongoose = require('mongoose')
const fs = require('fs')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')
const User = require('../models/user')

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
  let userWithPlaces
  try {
    userWithPlaces = await User.findById(userId).populate('places')
  } catch (error) {
    return next(new HttpError('Something went wrong', 500))
  }

  if (!userWithPlaces) {
    return next(
      new HttpError('Could not find a place for the provided user id', 404)
    )
  }

  if (!userWithPlaces.places.length) {
    return res.status(200).json({ places: [] })
  }

  res.status(200).json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    ),
  })
}

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    )
  }
  const { title, description, address } = req.body
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
    image: req.file.path,
    creator: req.userData.userId,
  })
  let user
  try {
    user = await User.findById(req.userData.userId)
  } catch (error) {
    next(new HttpError('Something went wrong while finding the user', 500))
  }

  if (!user) {
    next(new HttpError('Could not find user for provided id', 404))
  }

  try {
    // both MUST succeed otherwise it rolls back both places and user
    const session = await mongoose.startSession()
    session.startTransaction()
    await createdPlace.save({ session })
    user.places.push(createdPlace)
    await user.save({ session })
    await session.commitTransaction()
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

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError('You are not allowed to edit this place.', 401))
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
  let place
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not delete place.', 500)
    )
  }

  if (!place) {
    return next(new HttpError('Could not find the place for this id', 404))
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError('You are not allowed to delete this place.', 401))
  }

  const imagePath = place.image

  try {
    const session = await mongoose.startSession()
    session.startTransaction({ session })
    await place.remove({ session })
    place.creator.places.pull(place)
    await place.creator.save({ session })
    await session.commitTransaction()
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not delete place.', 500)
    )
  }

  fs.unlink(imagePath, error => {
    console.log(error)
  })

  res.status(200).json({ message: 'Deleted place' })
}
