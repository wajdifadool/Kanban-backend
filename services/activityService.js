const Activity = require('../models/Activity')

class ActivityService {
  static async log({
    userId,
    boardId,
    cardId = null,
    actionType,
    description,
    metadata = {},
  }) {
    try {
      const activity = await Activity.create({
        user_id: userId,
        board_id: boardId,
        card_id: cardId,
        action_type: actionType,
        description,
        metadata,
        created_at: new Date(),
      })

      // 🟢 Pretty log
      console.log('--------------------------------------')
      console.log('🟢 New Activity Logged:', activity)
      console.log('--------------------------------------')

      return activity
    } catch (err) {
      console.error('❌ Failed to log activity:', err)
      throw err
    }
  }
}

module.exports = ActivityService
