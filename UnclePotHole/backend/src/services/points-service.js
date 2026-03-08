const User = require('../models/user')
const { findRidingForPoint } = require('./riding-service')

const calculatePoints = async (userId, longitude, latitude) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const riding = await findRidingForPoint(longitude, latitude)
  if (!riding) {
    return { pointsAwarded: 0, ridingId: null, message: 'Location not in any riding' }
  }

  const isInUserRiding = riding._id.toString() === user.ridingId.toString()
  const pointsAwarded = isInUserRiding ? 1 : 0

  if (pointsAwarded > 0) {
    await User.findByIdAndUpdate(userId, {
      $inc: { totalPoints: 1, totalReports: 1 },
    })
  } else {
    await User.findByIdAndUpdate(userId, {
      $inc: { totalReports: 1 },
    })
  }

  return {
    pointsAwarded,
    ridingId: riding._id,
    ridingName: riding.name,
    message: isInUserRiding
      ? `Report submitted! You earned 1 point.`
      : `Report submitted. This location is outside your riding — no points awarded, but the city has been alerted.`,
  }
}

module.exports = { calculatePoints }
