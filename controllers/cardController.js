const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Card = require('../models/Card')
const fs = require('fs')
const path = require('path')
const Attachment = require('../models/Attachment')

// @desc    Get single card
// @route   GET /api/v1/cards/:cardId
// @access  Private
exports.getCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.id).populate(
    'assignees',
    'name email'
  )
  // .populate('labels', 'name color')

  if (!card) return next(new ErrorResponse(`Card not found`, 404))

  res.status(200).json({ success: true, data: card })
})

// @desc    Create card in list
// @route   POST /api/v1/cards
// @access  Private
exports.createCard = asyncHandler(async (req, res, next) => {
  // TODO:make sure the user have access to the board!
  const userId = req.user._id.toString()

  req.body.created_by = userId
  req.body.assignees = req.body.assignees || [userId]

  if (!req.body.boardId || !req.body.listId)
    return next(new ErrorResponse('BoardId and ListId are required', 400))

  const card = await Card.create(req.body)

  res.status(201).json({ success: true, data: card })
})

// @desc    Update card
// @route   PUT /api/v1/cards/:cardId
// @access  Private
exports.updateCard = asyncHandler(async (req, res, next) => {
  // TODO:make sure the user have access to the CARD!

  let card = await Card.findById(req.params.id)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  card = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: card })
})

// @desc    Delete card
// @route   DELETE /api/v1/cards/:cardId
// @access  Private
/* -------------------- Delete card -------------------- */
exports.deleteCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.id)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  await card.deleteOne()
  res.status(200).json({ success: true, data: {} })
})

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

/*___ ___  _ __ ___  _ __ ___   ___ _ __ | |_ ___ 
 / __/ _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __/ __|
| (_| (_) | | | | | | | | | | |  __/ | | | |_\__ \
 \___\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|___*/

// @desc    Add comment to card
// @route   POST /api/v1/cards/:cardId/comments
// @access  Private
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

// @desc    Update comment in card
// @route   PUT /api/v1/cards/:cardId/comments/:commentId
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  //  TODO: Comment Creator only aothrized to delete/ update its comments

  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))
  // Mongoose DocumentArray waprer methods, subDocumnets
  // .id(_id) → find a subdocument by its _id
  // .create() → create a subdocument with default schema rules
  // .pull() → remove a subdocument by ID or value

  // TODO:cehck if the commet is there before deleteion
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

// @desc    Delete comment in card
// @route   DELETE /api/v1/cards/:cardId/comments/:commentId
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  // TODO:make sure only creator can delete commment!
  const card = await Card.findById(req.params.cardId)
  if (!card) return next(new ErrorResponse('Card not found', 404))

  // TODO:make sure only creator can delete commment!

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

// @desc    Get all comments for card
// @route   GET /api/v1/cards/:cardId/comments/:commentId
// @access  Private
exports.getComments = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.cardId)

  if (!card) return next(new ErrorResponse('Card not found', 404))

  res.status(200).json({ success: true, data: card.comments })
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

/* -------------------- TODO: File Uploading -------------------- */

// @desc    request upload (returns presigned URL and attachment id
// @route   POST /api/v1/cards/:cardId/attachments
// @access  Private
exports.uploadFileToCard = asyncHandler(async (req, res, next) => {
  // TODO:maby this should be the middleware where we get the card each time
  const card = await Card.findOne({
    _id: req.params.id,
    $or: [{ created_by: req.user._id }, { assignees: req.user._id }],
  })

  if (!card)
    return next(new ErrorResponse('Card not found or not authorized', 404))

  // Check file existence
  if (!req.files || !req.files.file) {
    return next(new ErrorResponse('Please upload a file', 400))
  }

  const file = req.files.file

  // Validate file type (you can extend this)
  if (!file.mimetype.startsWith('image') && !file.mimetype.includes('pdf')) {
    return next(new ErrorResponse(`Please upload an image or PDF file`, 400))
  }

  // Validate file size
  if (file.size > process.env.FILE_UPLOAD_MAX) {
    return next(
      new ErrorResponse(
        `Please upload file smaller than ${
          process.env.FILE_UPLOAD_MAX / 1000000
        }MB`,
        400
      )
    )
  }

  // Ensure upload directory exists
  const uploadPath = process.env.FILE_UPLOAD_PATH
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
  }

  // Custom filename
  const ext = path.parse(file.name).ext
  const fileName = `card_${card._id}_${Date.now()}${ext}`
  const filePath = path.join(uploadPath, fileName)

  // Move file to upload folder
  file.mv(filePath, async (err) => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse('Problem with file upload', 500))
    }

    // Prepare attachment object
    // const attachmentObject = {
    //   filename: fileName,
    //   path: `/uploads/${fileName}`,
    //   mimetype: file.mimetype,
    //   size: file.size,
    // }

    const newAttachment = await Attachment.create({
      fileUrl: `/uploads/${fileName}`, // relative path
      fileName,
      uploadedBy: req.user._id,
      mimetype: file.mimetype,
      size: file.size,
      cardId: card._id,
    })

    // Add to card
    card.attachments.push(newAttachment)
    await card.save()

    res.status(200).json({
      success: true,
      data: newAttachment,
    })
  })
})
