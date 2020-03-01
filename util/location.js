const axios = require('axios')

const HttpError = require('../models/http-error')
const { GOOGLE_MAPS_API_KEY } = require('../secrets/secrets')

const getCoordsForAddress = async address => {
  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`
  )
  if (!data || data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for specified address.', 404)
  }

  const coordinates = data.results[0].geometry.location
  return coordinates
}

module.exports = getCoordsForAddress
