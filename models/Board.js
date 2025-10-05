const mongoose = require('mongoose')
// “The arrow entering the table that has the many symbol → that collection holds the ref.”
/* -------------------- Board -------------------- */
const BoardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a board title'],
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['admin', 'editor', 'viewer'],
          default: 'editor',
        },
      },
    ],
    labels: [
      {
        _id: false,
        name: { type: String, required: true, trim: true },
        color: { type: String, required: true, trim: true },
      },
    ],
    is_private: {
      type: Boolean,
      default: true, // or false, depending on your logic
      index: true, // optional: adds an index for faster queries
    },
    // used for archiving boards
    is_active: {
      type: Boolean,
      default: true, // or false, depending on your logic
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

module.exports = mongoose.model('Board', BoardSchema)
