const mongoose = require('mongoose')

const ridingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['mp', 'mpp'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    boundary: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true,
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
    center: {
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
  },
  { timestamps: true }
)

ridingSchema.index({ boundary: '2dsphere' })
ridingSchema.index({ type: 1, name: 1 })

module.exports = mongoose.model('Riding', ridingSchema)
