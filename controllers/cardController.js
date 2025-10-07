const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Card = require('../models/Card')

/* -------------------- Get all cards -------------------- */
// @route   GET /api/v1/cards
// @route   GET /api/v1/boards/:boardId/lists/:listId/cards
exports.getCards = asyncHandler(async (req, res, next) => {
  const query = {}

  if (req.params.listId) query.listId = req.params.listId
  if (req.params.boardId) query.boardId = req.params.boardId

  const cards = await Card.find(query)
    .populate('assignees', 'name email')
    // .populate('labels', 'name color') //TODO: fix the label
    .sort({ position: 1 })

  res.status(200).json({ success: true, count: cards.length, data: cards })
})

/* -------------------- Get single card -------------------- */
exports.getCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.id).populate(
    'assignees',
    'name email'
  )
  // .populate('labels', 'name color')

  if (!card) return next(new ErrorResponse(`Card not found`, 404))

  res.status(200).json({ success: true, data: card })
})

/* -------------------- Create card -------------------- */
exports.createCard = asyncHandler(async (req, res, next) => {
  const { boardId, listId } = req.params
  req.body.boardId = boardId || req.body.boardId
  req.body.listId = listId || req.body.listId

  if (!req.body.boardId || !req.body.listId)
    return next(new ErrorResponse('BoardId and ListId are required', 400))

  const card = await Card.create(req.body)

  res.status(201).json({ success: true, data: card })
})

/* -------------------- Update card -------------------- */
exports.updateCard = asyncHandler(async (req, res, next) => {
  let card = await Card.findById(req.params.id)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  card = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: card })
})

/* -------------------- Duplicate card -------------------- */
// @desc    Duplicate a card
// @route   POST /api/v1/cards/:cardId/duplicate
// @access  Private
exports.duplicateCard = asyncHandler(async (req, res, next) => {
  const originalCard = await Card.findById(req.params.cardId)
  if (!originalCard) {
    return next(new ErrorResponse('Card not found', 404))
  }

  // Clone card fields (shallow copy)
  const clonedData = originalCard.toObject()

  // Remove  fields that must be new
  delete clonedData._id
  delete clonedData.createdAt
  delete clonedData.updatedAt

  // Optionally: allow user to specify a target list
  clonedData.listId = req.body.listId || originalCard.listId
  clonedData.boardId = req.body.boardId || originalCard.boardId

  // Update title to indicate it's a copy
  clonedData.title = `${originalCard.title} (Copy)`

  // 4️⃣ Create the new card
  const duplicatedCard = await Card.create(clonedData)

  res.status(201).json({
    success: true,
    data: duplicatedCard,
  })
})

/* -------------------- Delete card -------------------- */
exports.deleteCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.id)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  await card.deleteOne()
  res.status(200).json({ success: true, data: {} })
})

/* -------------------- Comments -------------------- */

// @desc Add comment
exports.addComment = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  // .create() → makes a properly structured subdocument
  const newComment = card.comments.create({
    userId: req.user.id,
    text: req.body.text,
  })
  card.comments.push(newComment)
  //   const comment = { userId: req.user.id, text: req.body.text }
  //   card.comments.push(comment)

  await card.save()

  res.status(201).json({
    success: true,
    data: card.comments[card.comments.length - 1],
  })
})

// @desc Update comment
//  TODO: Comment Creator only aothrized to delete/ update its comments
exports.updateComment = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  // Mongoose DocumentArray waprer methods, subDocumnets
  // .id(_id) → find a subdocument by its _id
  // .create() → create a subdocument with default schema rules
  // .pull() → remove a subdocument by ID or value
  const comment = card.comments.id(req.params.commentId)

  //   vanila JS
  //   card.comments.find((c) => c._id.toString() === commentId)

  comment.text = req.body.text || comment.text

  await card.save()

  res.status(201).json({
    success: true,
    data: card.comments[card.comments.length - 1],
  })
})

// @desc Delete comment
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  // Monogoose Way
  card.comments.pull(req.params.commentId)
  //   card.comments.pull(req.params.commentId)

  // Vanila JS
  //   card.comments = card.comments.filter(
  //     (c) => c._id.toString() !== req.params.commentId
  //   )
  await card.save()

  res.status(200).json({ success: true, data: {} })
})

/* -------------------- TODO: Checklist -------------------- */

// @desc Add checklist item
exports.addChecklistItem = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  const item = { text: req.body.text, isDone: false }
  card.checklist.push(item)
  await card.save()

  res.status(201).json({
    success: true,
    data: card.checklist[card.checklist.length - 1],
  })
})

// @desc Toggle checklist item
exports.toggleChecklistItem = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  const item = card.checklist.id(req.params.itemId)
  if (!item) return next(new ErrorResponse('Checklist item not found', 404))

  item.isDone = !item.isDone
  await card.save()

  res.status(200).json({ success: true, data: item })
})

// @desc Delete checklist item
exports.deleteChecklistItem = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  card.checklist = card.checklist.filter(
    (i) => i._id.toString() !== req.params.itemId
  )
  await card.save()

  res.status(200).json({ success: true, data: card.checklist })
})
