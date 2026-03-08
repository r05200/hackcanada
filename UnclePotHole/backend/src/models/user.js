const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    ridingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Riding',
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReports: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
)

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ ridingId: 1, totalPoints: -1 })

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10)
}

module.exports = mongoose.model('User', userSchema)
