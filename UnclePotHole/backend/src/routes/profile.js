const express = require('express')
const auth = require('../middleware/auth')
const store = require('../store')

const router = express.Router()

// GET /api/users/me
router.get('/me', auth, (req, res) => {
  const user = req.user
  const categoryBreakdown = store.getCategoryBreakdown(user._id)

  res.json({
    user: {
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      ridingId: user.ridingId,
      totalPoints: user.totalPoints,
      totalReports: user.totalReports,
      createdAt: user.createdAt,
    },
    categoryBreakdown,
  })
})

// GET /api/users/me/reports
router.get('/me/reports', auth, (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const result = store.findReportsByUser(req.user._id, parseInt(page), Math.min(parseInt(limit), 100))

  res.json({
    data: result.data,
    total: result.total,
    page: parseInt(page),
  })
})

module.exports = router
