const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

// ---------- In-memory collections ----------
const users = []
const reports = []
let ridings = []

// ---------- Load ridings from bundled GeoJSON ----------
function seedRidings() {
  const filePath = path.resolve(__dirname, './data/ridings/toronto-ridings.json')
  if (!fs.existsSync(filePath)) {
    console.warn('No ridings GeoJSON found — ridings will be empty')
    return
  }
  const geojson = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  for (const feature of geojson.features) {
    const coords = feature.geometry.coordinates[0]
    const lngs = coords.map((c) => c[0])
    const lats = coords.map((c) => c[1])
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2

    ridings.push({
      _id: uuidv4(),
      name: feature.properties.name,
      type: feature.properties.type || 'mp',
      slug: feature.properties.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      boundary: feature.geometry,
      center: { type: 'Point', coordinates: [centerLng, centerLat] },
    })
  }
  console.log(`Loaded ${ridings.length} ridings into memory`)
}

// Seed on first require
seedRidings()

// ---------- Seed demo data ----------
async function seedDemo() {
  if (users.length > 0) return // already seeded

  const hash = await bcrypt.hash('password123', 10)

  const demoUsers = [
    { name: 'Alice Chen', email: 'alice@example.com' },
    { name: 'Bob Patel', email: 'bob@example.com' },
    { name: 'Carol Diaz', email: 'carol@example.com' },
    { name: 'Dave Kim', email: 'dave@example.com' },
    { name: 'Eve Nguyen', email: 'eve@example.com' },
  ]

  for (const u of demoUsers) {
    const riding = ridings[Math.floor(Math.random() * Math.max(ridings.length, 1))]
    users.push({
      _id: uuidv4(),
      displayName: u.name,
      email: u.email,
      passwordHash: hash,
      ridingId: riding?._id || null,
      totalPoints: Math.floor(Math.random() * 20),
      totalReports: Math.floor(Math.random() * 15),
      createdAt: new Date().toISOString(),
    })
  }

  // Create some demo reports
  const categories = ['pothole', 'road-defect', 'flooding', 'fallen-trees', 'damaged-lights']
  for (let i = 0; i < 15; i++) {
    const user = users[i % users.length]
    const riding = ridings[Math.floor(Math.random() * Math.max(ridings.length, 1))]
    const cat = categories[Math.floor(Math.random() * categories.length)]
    reports.push({
      _id: uuidv4(),
      userId: user._id,
      userName: user.displayName,
      description: `Demo ${cat} report #${i + 1}`,
      category: cat,
      location: {
        type: 'Point',
        coordinates: [
          -79.38 + (Math.random() - 0.5) * 0.1,
          43.65 + (Math.random() - 0.5) * 0.1,
        ],
      },
      ridingId: riding?._id || null,
      mlScores: Object.fromEntries(categories.map((c) => [c, Math.round(Math.random() * 100)])),
      confidence: Math.round(Math.random() * 100),
      mlProcessed: true,
      pointsAwarded: Math.random() > 0.3 ? 1 : 0,
      status: 'pending',
      createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    })
  }
  console.log(`Seeded ${users.length} demo users and ${reports.length} demo reports`)
}

// Auto-seed demo data
seedDemo()

// ---------- CRUD helpers ----------
module.exports = {
  // Users
  findUserById: (id) => users.find((u) => u._id === id),
  findUserByEmail: (email) => users.find((u) => u.email === email.toLowerCase()),
  createUser: async ({ displayName, email, password, ridingId }) => {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
      _id: uuidv4(),
      displayName: displayName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      ridingId: ridingId || null,
      totalPoints: 0,
      totalReports: 0,
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    return user
  },
  comparePassword: async (user, password) => bcrypt.compare(password, user.passwordHash),
  incrementUserStats: (userId, points) => {
    const user = users.find((u) => u._id === userId)
    if (user) {
      user.totalReports += 1
      user.totalPoints += points
    }
  },

  // Ridings
  getAllRidings: () => ridings,
  findRidingById: (id) => ridings.find((r) => r._id === id),

  // Reports
  createReport: (data) => {
    const report = { _id: uuidv4(), status: 'pending', createdAt: new Date().toISOString(), ...data }
    reports.push(report)
    return report
  },
  findReportById: (id) => reports.find((r) => r._id === id),
  findReportsByRiding: (ridingId, page = 1, limit = 50) => {
    const filtered = reports.filter((r) => r.ridingId === ridingId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const start = (page - 1) * limit
    return { data: filtered.slice(start, start + limit), total: filtered.length }
  },
  findReportsByUser: (userId, page = 1, limit = 20) => {
    const filtered = reports.filter((r) => r.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const start = (page - 1) * limit
    return { data: filtered.slice(start, start + limit), total: filtered.length }
  },
  getCategoryBreakdown: (userId) => {
    const userReports = reports.filter((r) => r.userId === userId)
    const breakdown = {}
    for (const r of userReports) {
      if (!breakdown[r.category]) breakdown[r.category] = { _id: r.category, count: 0 }
      breakdown[r.category].count += 1
    }
    return Object.values(breakdown)
  },
  getLeaderboard: (ridingId, limit = 50) => {
    return users
      .filter((u) => u.ridingId === ridingId)
      .sort((a, b) => b.totalPoints - a.totalPoints || b.totalReports - a.totalReports)
      .slice(0, limit)
      .map((u, i) => ({
        rank: i + 1,
        _id: u._id,
        displayName: u.displayName,
        totalPoints: u.totalPoints,
        totalReports: u.totalReports,
      }))
  },
}
