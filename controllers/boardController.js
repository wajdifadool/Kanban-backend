const Board = require('../models/Board')
const User = require('../models/user')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get all boards of logged-in user
// @route   GET /api/v1/boards
// @access  Private
exports.getBoards = asyncHandler(async (req, res, next) => {
  // find boards where user is owner OR a member
  const boards = await Board.find({
    $or: [{ owner: req.user.id }, { 'members.userId': req.user.id }],
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

// @desc    Create new board
// @route   POST /api/v1/boards
// @access  Private
exports.createBoard = asyncHandler(async (req, res, next) => {
  const { title, description, labels } = req.body

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

// @desc    Get single board by ID
// @route   GET /api/v1/boards/:id
// @access  Private
exports.getBoard = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.board,
  })
})

// @desc    Update board
// @route   PUT /api/v1/boards/:id
// @access  Private (Only owner can update Board)
exports.updateBoard = asyncHandler(async (req, res, next) => {
  const board = req.board

  board.title = req.body.title || board.title
  board.description = req.body.description || board.description
  board.labels = req.body.labels || board.labels

  // Only update is_private if it's explicitly provided
  // this will change the board visibility
  if (typeof req.body.is_private !== 'undefined') {
    board.is_private = req.body.is_private
  }

  await board.save()
  res.status(200).json({
    success: true,
    data: board,
  })
})

// @desc    Delete board
// @route   DELETE /api/v1/boards/:boardId
// @access  Private (Only owner can delete Board)
exports.deleteBoard = asyncHandler(async (req, res, next) => {
  await req.board.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Board deleted successfully',
  })
})

// @desc    Add member to board
// @route   POST /api/v1/boards/:boardId/members
// @access  Private (Owner only)
exports.addMember = asyncHandler(async (req, res, next) => {
  const memberId = req.body.memberId
  const board = req.board
  const ownerId = req.board.owner.toString()

  console.log(memberId)
  console.log(ownerId)

  if (ownerId === memberId) {
    return next(new ErrorResponse('Owner already  is memeber', 400))
  }
  const userExists = await User.exists({ _id: memberId })
  if (!userExists) {
    return next(new ErrorResponse('User not found', 400))
  }

  const isMember = board.members.some((m) => m.userId.toString() === memberId)
  if (isMember) {
    return next(new ErrorResponse('User already a member', 400))
  }

  req.board.members.push({ userId: memberId, role: 'editor' })

  await board.save()
  res.status(200).json({
    success: true,
    data: board,
  })
})

// @desc    Remove member from  board
// @route   DELETE /api/v1/boards/:id/members
// @access  Private (Owner only)
exports.removeMember = asyncHandler(async (req, res, next) => {
  const memberId = req.body.memberId
  const board = req.board
  const ownerId = req.board.owner.toString()

  if (!memberId) {
    return next(new ErrorResponse('Collaborator ID is required', 400))
  }

  if (ownerId === memberId) {
    return next(new ErrorResponse('Cannot remove the board owner', 400))
  }

  const memberIndex = board.members.findIndex(
    (m) => m.userId.toString() === memberId
  )

  if (memberIndex === -1) {
    return next(new ErrorResponse('User is not a collaborator', 404))
  }

  board.members.splice(memberIndex, 1)

  await board.save()

  res.status(200).json({
    success: true,
    data: board,
  })
})
