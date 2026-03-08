const express = require('express')
const auth = require('../middleware/auth')
const store = require('../store')

const router = express.Router()

// GET /api/leaderboard/:ridingId
router.get('/:ridingId', auth, (req, res) => {
  const { ridingId } = req.params
  const limit = Math.min(parseInt(req.query.limit) || 50, 100)

  const riding = store.findRidingById(ridingId)
  if (!riding) {
    return res.status(404).json({ error: 'Riding not found' })
  }

  const rankings = store.getLeaderboard(ridingId, limit)

  res.json({
    riding: { _id: riding._id, name: riding.name, type: riding.type },
    rankings,
  })
})

module.exports = router
