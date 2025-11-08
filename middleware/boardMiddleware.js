const Board = require('../models/Board')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc owner is always in Collaborator list //TODO:fix logic
exports.checkAccess = (
  options = { allowOwner: true, allowCollaborator: true }
) => {
  return (req, res, next) => {
    const board = req.board

    if (!req.user) {
      return next(new ErrorResponse('Unauthorized access context missing', 500))
    }
    const isOwner = board.owner._id.equals(req.user.id)
    const isCollaborator = board.members.some((m) =>
      m.userId._id.equals(req.user.id)
    )
    req.access = { isOwner, isCollaborator }

    if (
      (options.allowOwner && isOwner) ||
      (options.allowCollaborator && isCollaborator)
    ) {
      return next()
    }
    return next(
      new ErrorResponse('Not authorized to view/edit this board', 403)
    )
  }
}

// @desc    Get single board by ID
// @route   GET /api/v1/boards/:boardId
// @access  Private
exports.fetchBoard = asyncHandler(async (req, res, next) => {
  // TODO: add indexing for faster request, add reddis , add cookies
  const board = await Board.findOne({
    _id: req.params.boardId,
    $or: [{ owner: req.user.id }, { 'members.userId': req.user.id }],
  })

  if (!board) {
    return next(
      new ErrorResponse(
        `Board not found with id ${req.params.boardId}or the user have no access to board`,
        404
      ) //TODO: beeter response !
    )
  }

  req.board = board
  next()
})
