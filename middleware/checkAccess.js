const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')

exports.checkAccess = (
  options = { allowOwner: true, allowCollaborator: true }
) => {
  return (req, res, next) => {
    // console.log('middleware checkAccess ran')
    if (!req.user) {
      return next(new ErrorResponse('Unauthorized access context missing', 500))
    }

    const isOwner = req.todo.owner.toString() === req.user.id
    const isCollaborator = req.todo.members.some(
      (id) => id.toString() === req.user.id
    )

    req.access = { isOwner, isCollaborator }

    if (
      (options.allowOwner && isOwner) ||
      (options.allowCollaborator && isCollaborator)
    ) {
      return next()
    }

    return next(new ErrorResponse('Not authorized to access this todo', 403))
  }
}
