// middleware/getList.js

const List = require('../models/List')

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

exports.getListMiddleware = asyncHandler(async (req, res, next) => {
  const list = await List.findById(req.params.id).populate(
    'boardId',
    'owner members'
  )

  if (!list) return next(new ErrorResponse('List not found', 404))

  req.list = list // attach to req for next handlers
  console.log(list)
  next()
})
