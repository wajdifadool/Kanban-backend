const List = require('../models/List')

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Card = require('../models/Card')

// @desc    Get all lists for a board
// @route   GET /api/v1/boards/:boardId/lists
// @access  Private
exports.getLists = asyncHandler(async (req, res, next) => {
  const lists = await List.find({ boardId: req.params.boardId }).sort({
    position: 1,
  })

  res.status(200).json({
    success: true,
    count: lists.length,
    data: lists,
  })
})

// @desc    Get list for a board
// @route   GET /api/v1/boards/:boardId/lists/:listId
// @access  Private
exports.getList = asyncHandler(async (req, res, next) => {
  const list = await List.findById(req.params.listId)
  res.status(200).json({
    success: true,
    data: list,
  })
})

// @desc    Get list for a board including cards
// @route   GET /api/v1/boards/:boardId/lists/:listId/cards
// @access  Private
exports.getListWithCards = asyncHandler(async (req, res, next) => {
  const listId = req.params.listId

  const list = await List.findById(listId)
    .populate('boardId', 'owner members') // only load what's needed
    .lean() // faster, returns plain JS object

  if (!list) {
    return next(new ErrorResponse('List not found', 404))
  }
  const cards = await Card.find({ listId }).sort({ position: 1 }).lean()
  list.cards = cards

  res.status(200).json({
    success: true,
    data: list,
  })
})

// @desc    Create new list in a board
// @route   POST /api/v1/boards/:boardId/lists
// @access  Private
exports.createList = asyncHandler(async (req, res, next) => {
  const boardId = req.params.boardId
  const { title, position } = req.body

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

// @desc    Delete list
// @route   PUT /api/v1/boards/:boardId/lists/:listId
// @access  Private
exports.updateList = asyncHandler(async (req, res, next) => {
  const listId = req.params.listId

  const disallowed = ['_id', 'boardId', 'createdAt']
  // TODO:make sure to handle validation errors
  const updateData = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => !disallowed.includes(key))
  )

  const list = await List.findByIdAndUpdate(
    listId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({
    success: true,
    data: list,
  })
})

// @desc    Delete list
// @route   PUT /api/v1/boards/:boardId/lists/:listId
// @access  Private
exports.deleteList = asyncHandler(async (req, res, next) => {
  console.log('object')
  const list = await List.findById(req.params.listId)
  await list.deleteOne()
  res.status(200).json({
    success: true,
    message: 'List deleted successfully',
  })
})
