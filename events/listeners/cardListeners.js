const eventBus = require('../eventBus')
const ActivityService = require('../../services/activityService')

// CARD CREATED
eventBus.on('card.created', async ({ user, card }) => {
  console.log('card created activity')
  await ActivityService.log({
    userId: user._id,
    boardId: card.boardId,
    cardId: card._id,
    actionType: 'CARD_CREATED',
    description: `${user.name} created card "${card.title}"`,
    metadata: { title: card.title },
  })
})

// CARD UPDATED
eventBus.on('card.updated', async ({ user, card }) => {
  await ActivityService.log({
    userId: user._id,
    boardId: card.boardId,
    cardId: card._id,
    actionType: 'CARD_UPDATED',
    description: `${user.name} updated card "${card.title}"`,
    metadata: { title: card.title },
  })
})

// CARD MOVED
eventBus.on('card.moved', async ({ user, card, fromListId, toListId }) => {
  await ActivityService.log({
    userId: user._id,
    boardId: card.boardId,
    cardId: card._id,
    actionType: 'CARD_MOVED',
    description: `${user.name} moved card "${card.title}"`,
    metadata: { fromListId, toListId },
  })
})

// CARD DUPLICATED
eventBus.on('card.duplicated', async ({ user, card, fromListId, toListId }) => {
  await ActivityService.log({
    userId: user._id,
    boardId: card.boardId,
    cardId: card._id,
    actionType: 'CARD_DUPLICATED',
    description: `${user.name} Duplicated card "${card.title}"`,
    metadata: { fromListId, toListId },
  })
})

// CARD DELETED
eventBus.on('card.deleted', async ({ user, card }) => {
  await ActivityService.log({
    userId: user._id,
    boardId: card.boardId,
    cardId: card._id,
    actionType: 'CARD_DELETED',
    description: `${user.name} deleted card "${card.title}"`,
    metadata: { title: card.title },
  })
})
