require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Initialize in-memory store (auto-seeds ridings + demo data on require)
require('./src/store')

const authRoutes = require('./src/routes/auth')
const reportRoutes = require('./src/routes/reports')
const ridingRoutes = require('./src/routes/ridings')
const leaderboardRoutes = require('./src/routes/leaderboard')
const profileRoutes = require('./src/routes/profile')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '15mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/ridings', ridingRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/users', profileRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
  console.log(`In-memory store active (no MongoDB required)`)
})

module.exports = app
