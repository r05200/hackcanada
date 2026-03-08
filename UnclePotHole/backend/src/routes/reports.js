const express = require('express')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const store = require('../store')
const { classify } = require('../ml/classifier')
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default
const { point } = require('@turf/helpers')

const router = express.Router()

// POST /api/reports — submit a new report
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude and longitude are required' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' })
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    // Find which riding the location is in
    const ridings = store.getAllRidings()
    const pt = point([lng, lat])
    let matchedRiding = null
    for (const riding of ridings) {
      if (riding.boundary && booleanPointInPolygon(pt, { type: 'Feature', geometry: riding.boundary })) {
        matchedRiding = riding
        break
      }
    }

    // Calculate points
    const isInUserRiding = matchedRiding && req.user.ridingId === matchedRiding._id
    const pointsAwarded = isInUserRiding ? 1 : 0
    store.incrementUserStats(req.user._id, pointsAwarded)

    // Auto-categorize via ML
    let category = 'road-defect'
    let mlScores = {}
    let confidence = 0

    try {
      const mlResult = await classify(req.file.buffer)
      category = mlResult.category
      mlScores = mlResult.scores
      confidence = mlResult.confidence
    } catch (mlErr) {
      console.error('ML classification failed:', mlErr.message)
    }

    const report = store.createReport({
      userId: req.user._id,
      userName: req.user.displayName,
      description: description || '',
      category,
      location: { type: 'Point', coordinates: [lng, lat] },
      ridingId: matchedRiding?._id || null,
      mlScores,
      confidence,
      mlProcessed: true,
      pointsAwarded,
    })

    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/reports?ridingId=xxx&page=1&limit=50
router.get('/', auth, (req, res) => {
  const { ridingId, page = 1, limit = 50 } = req.query
  if (!ridingId) {
    return res.status(400).json({ error: 'ridingId is required' })
  }
  const result = store.findReportsByRiding(ridingId, parseInt(page), Math.min(parseInt(limit), 100))
  res.json({ data: result.data, total: result.total, page: parseInt(page) })
})

// GET /api/reports/:id
router.get('/:id', auth, (req, res) => {
  const report = store.findReportById(req.params.id)
  if (!report) {
    return res.status(404).json({ error: 'Report not found' })
  }
  res.json(report)
})

module.exports = router
