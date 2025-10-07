const mongoose = require('mongoose')

//
/* -------------------- List -------------------- */
const ListSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a list title'],
    },
    position: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

/* -------------------- Exports -------------------- */
module.exports = mongoose.model('List', ListSchema)
