// middleware/verifyBoardMember.js
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')

exports.isMemberinBoard = asyncHandler(async (req, res, next) => {
  console.log('isMemebr')

  const board = req.board
  const isMember =
    board.owner.toString() === req.user.id ||
    board.members.some((m) => m.userId.toString() === req.user.id)

  if (!isMember) {
    return next(new ErrorResponse(`Not authorized to `, 403))
  }

  next()
})
