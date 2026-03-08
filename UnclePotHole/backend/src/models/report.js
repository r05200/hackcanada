const mongoose = require('mongoose')

const CATEGORIES = [
  'road-defect',
  'flooding',
  'fallen-trees',
  'damaged-lights',
  'pothole',
]

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    ridingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Riding',
      required: true,
    },
    image: {
      type: Buffer,
      required: true,
    },
    imageMimeType: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/png'],
    },
    mlScores: {
      type: Map,
      of: Number,
      default: {},
    },
    mlProcessed: {
      type: Boolean,
      default: false,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    status: {
      type: String,
      default: 'Submitted',
    },
  },
  { timestamps: true }
)

reportSchema.index({ location: '2dsphere' })
reportSchema.index({ ridingId: 1, createdAt: -1 })
reportSchema.index({ userId: 1, createdAt: -1 })

reportSchema.statics.CATEGORIES = CATEGORIES

module.exports = mongoose.model('Report', reportSchema)
