// middleware/verifyBoardMember.js
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')

/**
 * Middleware to check if the current user is a member of the board.
 * Relies on req.list.boardId being populated with owner and members.
 * @param {String} [action='access this resource'] - optional action name for error messages
 */
exports.verifyBoardMember = (action = 'access this resource') =>
  asyncHandler(async (req, res, next) => {
    // if (!req.list || !req.list.boardId) {
    //   return next(new ErrorResponse('Board context not found', 400))
    // }

    const board = req.list.boardId
    const isMember =
      board.owner.toString() === req.user.id ||
      board.members.some((m) => m.userId.toString() === req.user.id)

    if (!isMember) {
      return next(new ErrorResponse(`Not authorized to ${action}`, 403))
    }

    next()
  })
