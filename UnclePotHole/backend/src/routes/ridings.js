const express = require('express')
const store = require('../store')

const router = express.Router()

// GET /api/ridings — list all ridings (no boundary polygon)
router.get('/', (req, res) => {
  const ridings = store.getAllRidings().map(({ boundary, ...rest }) => rest)
  res.json(ridings)
})

// GET /api/ridings/:id — single riding with boundary
router.get('/:id', (req, res) => {
  const riding = store.findRidingById(req.params.id)
  if (!riding) {
    return res.status(404).json({ error: 'Riding not found' })
  }
  res.json(riding)
})

module.exports = router
