const mongoose = require('mongoose')
// “The arrow entering the table that has the many symbol → that collection holds the ref.”
/**
 * You can expose a small label management API if needed:

Route	Description
  PUT /api/v1/boards/:id/labels/:labelId	Update a specific label’s name/color
  POST /api/v1/boards/:id/labels	Add a new label
  DELETE /api/v1/boards/:id/labels/:labelId	Delete a label
 */
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

    // labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }], move to this
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

BoardSchema.methods.isMember = function (userId) {
  return (
    this.owner.equals(userId) ||
    this.members.some((m) => m.userId.equals(userId))
  )
}
