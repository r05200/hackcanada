require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/user')
const Report = require('../models/report')
const Riding = require('../models/riding')

const seedDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const ridings = await Riding.find({}).limit(3)
    if (ridings.length === 0) {
      console.error('No ridings found. Run seed:ridings first.')
      process.exit(1)
    }

    const passwordHash = await User.hashPassword('demo123')

    const users = []
    const names = ['Alex Chen', 'Priya Sharma', 'Marcus Johnson', 'Fatima Ali', 'Leo Park']

    for (let i = 0; i < names.length; i++) {
      const riding = ridings[i % ridings.length]
      const user = await User.findOneAndUpdate(
        { email: `demo${i + 1}@civic.pulse` },
        {
          displayName: names[i],
          email: `demo${i + 1}@civic.pulse`,
          passwordHash,
          ridingId: riding._id,
          totalPoints: Math.floor(Math.random() * 20),
          totalReports: Math.floor(Math.random() * 25),
        },
        { upsert: true, new: true }
      )
      users.push(user)
      console.log(`Seeded user: ${user.displayName}`)
    }

    // Create a 1x1 white pixel JPEG as placeholder image
    const placeholderImage = Buffer.from(
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwA//9k=',
      'base64'
    )

    const categories = Report.CATEGORIES
    const descriptions = [
      'Large pothole on main road causing traffic issues',
      'Flooding near intersection after heavy rainfall today',
      'Fallen tree branch blocking the sidewalk completely',
      'Street light has been out for over a week now',
      'Deep pothole near bus stop needs urgent repair',
    ]

    for (let i = 0; i < 15; i++) {
      const user = users[i % users.length]
      const riding = ridings[i % ridings.length]
      const coords = riding.center.coordinates
      const jitter = () => (Math.random() - 0.5) * 0.01

      await Report.create({
        userId: user._id,
        description: descriptions[i % descriptions.length],
        category: categories[i % categories.length],
        location: {
          type: 'Point',
          coordinates: [coords[0] + jitter(), coords[1] + jitter()],
        },
        ridingId: riding._id,
        image: placeholderImage,
        imageMimeType: 'image/jpeg',
        mlScores: { [categories[i % categories.length]]: 85 + Math.floor(Math.random() * 15) },
        mlProcessed: true,
        pointsAwarded: user.ridingId.toString() === riding._id.toString() ? 1 : 0,
        status: 'Submitted',
      })
    }

    console.log('Seeded 15 demo reports')
    console.log('Demo login: demo1@civic.pulse / demo123')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedDemo()
