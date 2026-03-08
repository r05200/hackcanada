require('dotenv').config()
const mongoose = require('mongoose')
const Riding = require('../models/riding')
const ridingsData = require('./ridings/toronto-ridings.json')

const seedRidings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    for (const feature of ridingsData.features) {
      const { name, type, slug } = feature.properties

      // Calculate center from polygon coordinates
      const coords = feature.geometry.coordinates[0]
      const lngs = coords.map((c) => c[0])
      const lats = coords.map((c) => c[1])
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2

      await Riding.findOneAndUpdate(
        { slug },
        {
          name,
          type,
          slug,
          boundary: feature.geometry,
          center: {
            type: 'Point',
            coordinates: [centerLng, centerLat],
          },
        },
        { upsert: true, new: true }
      )

      console.log(`Seeded riding: ${name}`)
    }

    console.log(`Done — ${ridingsData.features.length} ridings seeded`)
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedRidings()
