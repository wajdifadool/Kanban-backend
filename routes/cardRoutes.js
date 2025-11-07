const express = require('express')
const router = express.Router({ mergeParams: true })
const { protect } = require('../middleware/auth')

const {
  checkBoardAndCardAccess,
  fetchCard,
} = require('../middleware/cardMiddleware')

const {
  getCard,
  createCard,
  updateCard,
  deleteCard,
  duplicateCard,
  addComment,
  deleteComment,
  updateComment,
  uploadFileToCard,
  deleteAttachment,
  getComments,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} = require('../controllers/cardController')

router.use(protect) //all routes below require authentication

// /api/v1/cards
// OK
router.route('/').post(checkBoardAndCardAccess, createCard)

router
  .route('/:cardId')

  .get(fetchCard, getCard) // OK
  .put(fetchCard, updateCard) // OK
  .delete(fetchCard, deleteCard) // OK

router
  .route('/:cardId/comments')
  .post(fetchCard, addComment) // OK
  .get(fetchCard, getComments) // OK

router.post('/:cardId/duplicate', fetchCard, duplicateCard)

router
  .route('/:cardId/comments/:commentId')
  .put(fetchCard, updateComment) // OK
  .delete(fetchCard, deleteComment) // OK

router.route('/:id/attachments').post(protect, uploadFileToCard)
router.route('/:id/attachments/:attachmentId').delete(protect, deleteAttachment)

/* ---------------------- Nested Routes: Checklist ---------------------- */

// @desc    Add checklist item
// @route   POST /api/v1/cards/:cardId/checklist
// @access  Private
router.route('/:cardId/checklist').post(protect, addChecklistItem)

// @desc    Toggle checklist item done/undone
// @route   PUT /api/v1/cards/:cardId/checklist/:itemId
// @access  Private
router.route('/:cardId/checklist/:itemId').put(protect, toggleChecklistItem)

// @desc    Delete checklist item
// @route   DELETE /api/v1/cards/:cardId/checklist/:itemId
// @access  Private
router.route('/:cardId/checklist/:itemId').delete(protect, deleteChecklistItem)

// uploading file
module.exports = router
