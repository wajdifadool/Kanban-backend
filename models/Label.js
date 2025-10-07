const mongoose = require('mongoose')

//
/* -------------------- Label -------------------- */
const LabelSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a label name'],
      trim: true,
      maxlength: 50,
    },
    color: {
      type: String,
      required: [true, 'Please add a label color'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Label', LabelSchema)
