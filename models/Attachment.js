const mongoose = require('mongoose')

const AttachmentSchema = new mongoose.Schema({
  fileUrl: String,
  fileName: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mimetype: String,
  size: Number,
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
})

module.exports = mongoose.model('Attachment', AttachmentSchema)
