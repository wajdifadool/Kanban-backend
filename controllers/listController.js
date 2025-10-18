const List = require('../models/List')

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get all lists for a board
// @route   GET /api/v1/boards/:boardId/lists
// @access  Private
exports.getLists = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params

  const lists = await List.find({ boardId }).sort({ position: 1 })

  res.status(200).json({
    success: true,
    count: lists.length,
    data: lists,
  })
})

// @desc    Get single list
// @route   GET /api/v1/lists/:id
// @access  Private
exports.getList = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.list,
  })
})

// @desc    Create new list in a board
// @route   POST /api/v1/boards/:boardId/lists
// @access  Private
exports.createList = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params
  const { title, position } = req.body

  if (!title) {
    return next(new ErrorResponse('Please add a list title', 400))
  }

  const list = await List.create({
    boardId,
    title,
    position: position || 0,
  })

  res.status(201).json({
    success: true,
    data: list,
  })
})

// @desc    Update list
// @route   PUT /api/v1/lists/:id
// @access  Private
exports.updateList = asyncHandler(async (req, res, next) => {
  // TODO: consider update the whole body
  //     { $set: req.body },
  const fieldsToUpdate = {
    title: req.body.title || req.list.title,
    position: req.body.position ?? req.list.position,
    updatedAt: Date.now(),
  }

  req.list = await List.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: req.list,
  })
})

// @desc    Delete list
// @route   DELETE /api/v1/lists/:id
// @access  Private
exports.deleteList = asyncHandler(async (req, res, next) => {
  await req.list.deleteOne()
  res.status(200).json({
    success: true,
    message: 'List deleted successfully',
  })
})
