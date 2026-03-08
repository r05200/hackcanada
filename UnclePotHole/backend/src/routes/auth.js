const express = require('express')
const jwt = require('jsonwebtoken')
const store = require('../store')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { displayName, email, password, ridingId } = req.body

    if (!displayName || !email || !password) {
      return res.status(400).json({ error: 'displayName, email and password are required' })
    }

    if (displayName.length < 2 || displayName.length > 30) {
      return res.status(400).json({ error: 'Display name must be 2-30 characters' })
    }

    const existing = store.findUserByEmail(email)
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    if (ridingId) {
      const riding = store.findRidingById(ridingId)
      if (!riding) {
        return res.status(400).json({ error: 'Invalid riding selected' })
      }
    }

    const user = await store.createUser({ displayName, email, password, ridingId })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        ridingId: user.ridingId,
        totalPoints: user.totalPoints,
        totalReports: user.totalReports,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = store.findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await store.comparePassword(user, password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

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
      token,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
