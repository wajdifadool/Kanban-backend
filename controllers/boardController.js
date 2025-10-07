const Board = require('../models/Board')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

/// @desc   Get all boards of logged-in user
// @route   GET /api/v1/boards
// @access  Private
exports.getBoards = asyncHandler(async (req, res, next) => {
  // find boards where user is owner OR a member
  // console.log(req.user.id)
  // console.log(req.user.id)
  const boards = await Board.find({
    $or: [{ owner: req.user.id }, { 'members.userId': req.user.id }],
    // will get all boards where in the table of boards it have the user.id as the owner or the user.id is in the members array in the table
  })
    .populate('owner', 'name email')
    .populate('members.userId', 'name email')
    .sort({ createdAt: -1 })

  if (!boards || boards.length === 0) {
    return next(new ErrorResponse('No boards found', 404))
  }

  res.status(200).json({
    success: true,
    count: boards.length,
    data: boards,
  })
})

/// @desc   Create new board
// @route   POST /api/v1/boards
// @access  Private
exports.createBoard = asyncHandler(async (req, res, next) => {
  const { title, description, labels } = req.body

  if (!title) {
    return next(new ErrorResponse('Please provide a board title', 400))
  }

  //   const defaultLabels = [
  //     { name: 'none', color: '#EB5A46' },
  //     { name: 'none', color: '#0079BF' },
  //     { name: 'none', color: '#61BD4F' },
  //     { name: 'none', color: '#F2D600' },
  //   ]

  const board = await Board.create({
    title,
    description,
    labels,
    owner: req.user.id,
    members: [{ userId: req.user.id, role: 'admin' }],
  })

  res.status(201).json({
    success: true,
    data: board,
  })
})

/*
{
    "success": true,
    "data": {
        "is_private": true,
        "is_active": true,
        "_id": "68e215b226f953da6caecd30",
        "title": "main board Version 1 ",
        "owner": "68dfe916a6e211bad9669d13",
        "members": [
            {
                "userId": "68dfe916a6e211bad9669d13",
                "role": "admin",
                "_id": "68e215b226f953da6caecd31"
            }
        ],
        "labels": [],
        "createdAt": "2025-10-05T06:52:34.362Z",
        "updatedAt": "2025-10-07T08:50:19.850Z",
        "__v": 0,
        "description": "this is description for the main board"
    }
}
*/
/// @desc   Get single board by ID
// @route   GET /api/v1/boards/:id
// @access  Private
exports.getBoard = asyncHandler(async (req, res, next) => {
  console.log('called get board')
  // TODO: add indexing for faster request, add reddis , add cookies
  const board = await Board.findOne({
    _id: req.params.id,
    $or: [{ owner: req.user.id }, { 'members.userId': req.user.id }],
  })
  // .populate('owner', 'name email')
  // .populate('members.userId', 'name email')

  // const board = await Board.findById(req.params.id)
  //   .populate('owner', 'name email')
  //   .populate('members.userId', 'name email')

  // if (!board) {
  //   return next(
  //     new ErrorResponse(`Board not found with id ${req.params.id}`, 404)
  //   )
  // }

  // check if user is owner or member
  // const isMember =
  //   board.owner._id.equals(req.user.id) ||
  //   board.members.some((m) => m.userId._id.equals(req.user.id))

  // TODO: maby remove to middleware
  // if (!isMember) {
  //   return next(new ErrorResponse('Not authorized to view this board', 403))
  // }

  res.status(200).json({
    success: true,
    data: board,
  })
})

/// @desc   Update board
// @route   PUT /api/v1/boards/:id
// @access  Private (Only owner can update Board)
exports.updateBoard = asyncHandler(async (req, res, next) => {
  // Fetch Board and make user
  let board = await Board.findOne({
    _id: req.params.id,
    owner: req.user.id,
  })

  board.title = req.body.title || board.title
  board.description = req.body.description || board.description
  board.labels = req.body.labels || board.labels

  await board.save()
  res.status(200).json({
    success: true,
    data: board,
  })
})

/// @desc   Delete board
// @route   DELETE /api/v1/boards/:id
// @access  Private (Only owner can delete Board)
exports.deleteBoard = asyncHandler(async (req, res, next) => {
  let board = await Board.findOne({
    _id: req.params.id,
    owner: req.user.id,
  })
  await board.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Board deleted successfully',
  })
})
