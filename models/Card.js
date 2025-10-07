const mongoose = require('mongoose')

/* -------------------- Task (Card) -------------------- */

const CardSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
    },
    description: {
      type: String,
    },
    dueDate: { type: Date },

    // labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],

    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attachments: [
      {
        fileUrl: String,
        fileName: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    checklist: [
      {
        text: String,
        isDone: { type: Boolean, default: false },
      },
    ],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    position: { type: Number, default: 0 },

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

module.exports = mongoose.model('Card', CardSchema)
