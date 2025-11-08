const Board = require('../models/Board')
const List = require('../models/List')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

const Card = require('../models/Card')

exports.checkBoardAndCardAccess = asyncHandler(async (req, res, next) => {
  const userId = req.user._id.toString()
  const { boardId, listId } = req.body

  if (!boardId || !listId) {
    return next(new ErrorResponse('boardId and listId are required', 400))
  }

  const hasAccess = await Board.exists({
    _id: boardId,
    $or: [{ owner: userId }, { 'members.userId': userId }],
  })

  if (!hasAccess) {
    return next(new ErrorResponse('Board not found or no access', 404))
  }

  // 2️⃣ Verify that the list exists and belongs to this board
  const validList = await List.exists({ _id: listId, boardId })

  if (!validList) {
    return next(
      new ErrorResponse('List not found or does not belong to this board', 404)
    )
  }

  next()
})

exports.fetchCard = asyncHandler(async (req, res, next) => {
  // console.log('Fetch card called ')
  const { cardId } = req.params
  const userId = req.user._id

  const card = await Card.findById(cardId)
    .populate('assignees', 'name email')
    .populate({
      path: 'boardId',
      select: 'owner members',
    })
  if (!card) {
    return next(new ErrorResponse('Card not found', 404))
  }
  const board = card.boardId

  if (!card.boardId) {
    return next(new ErrorResponse('Card context not loaded', 400))
  }

  const hasAccess =
    board.owner._id.equals(userId) ||
    board.members.some((m) => m.userId._id.equals(userId))

  if (!hasAccess) {
    return next(new ErrorResponse('Not authorized to access this card', 403))
  }
  req.card = card
  next()
})
