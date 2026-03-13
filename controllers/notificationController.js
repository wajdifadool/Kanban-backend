// src/controllers/notificationController.js
const Notification = require('../models/Notification')

exports.getNotifications = async (req, res, next) => {
  const userId = req.user._id
  const notifications = await Notification.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(100)
  res
    .status(200)
    .json({ success: true, count: notifications.length, data: notifications })
}

exports.markAsRead = async (req, res, next) => {
  const userId = req.user._id
  const notId = req.params.id

  const n = await Notification.findOneAndUpdate(
    { _id: notId, user_id: userId },
    { read: true },
    { new: true }
  )

  if (!n)
    return res
      .status(404)
      .json({ success: false, message: 'Notification not found' })

  res.status(200).json({ success: true, data: n })
}
