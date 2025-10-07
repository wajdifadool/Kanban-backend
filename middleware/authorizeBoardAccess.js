const Board = require('../models/Board')
const ErrorResponse = require('../utils/errorResponse')

exports.authorizeBoardAccess = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user.id }, { 'members.userId': req.user.id }],
    })
      .populate('owner', 'name email')
      .populate('members.userId', 'name email')

    if (!board) {
      return next(new ErrorResponse('Board not found or not authorized', 404))
    }

    req.board = board // attach for downstream controllers
    next()
  } catch (err) {
    next(err)
  }
}
