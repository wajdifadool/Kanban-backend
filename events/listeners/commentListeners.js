const eventBus = require('../eventBus')
const ActivityService = require('../../services/activityService')

// COMMENT CREATED
eventBus.on('comment.created', async ({ user, card }) => {
  const obj = {
    userId: user._id,
    boardId: card.boardId,
    cardId: card._id,
    actionType: 'COMMENT_CREATED',
    description: `${user.name} added comment ${
      card.comments[card.comments.length - 1].text
    } for the card "${card.title}"`,
    metadata: { title: card.title },
  }
  await ActivityService.log(obj)
})
