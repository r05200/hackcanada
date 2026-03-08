const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default
const { point } = require('@turf/helpers')
const Riding = require('../models/riding')

const findRidingForPoint = async (lng, lat) => {
  const ridings = await Riding.find({})
  const pt = point([lng, lat])

  for (const riding of ridings) {
    const polygon = {
      type: 'Feature',
      geometry: riding.boundary,
    }

    if (booleanPointInPolygon(pt, polygon)) {
      return riding
    }
  }

  return null
}

module.exports = { findRidingForPoint }
