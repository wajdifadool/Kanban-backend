const Board = require('../models/Board')

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

exports.getBoardMiddleware = asyncHandler(async (req, res, next) => {
  console.log('getBoardMiddleware')
  const { boardId } = req.params

  // Check if board exists and user has access
  const board = await Board.findById(boardId)
  if (!board) {
    return next(new ErrorResponse(`Board not found with id ${boardId}`, 404))
  }
  console.log('completed getBoardMiddleware', board)
  req.board = board

  next()
})
