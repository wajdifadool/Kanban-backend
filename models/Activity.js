const mongoose = require('mongoose')

const ActivitySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    board_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },

    card_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      default: null,
    },

    action_type: {
      type: String,
      required: true,
      enum: [
        'CARD_CREATED',
        'CARD_UPDATED',
        'CARD_MOVED',
        'CARD_DUPLICATED',
        'CARD_DELETED',
        'COMMENT_CREATED',
      ],
    },

    description: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
)

module.exports = mongoose.model('Activity', ActivitySchema)
