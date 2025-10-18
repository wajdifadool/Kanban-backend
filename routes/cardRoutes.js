const express = require('express')
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
const { protect } = require('../middleware/auth')
const router = express.Router()

// /api/v1/cards

router.route('/').post(protect, createCard)

router
  .route('/:id')
  .get(protect, getCard)
  .put(protect, updateCard)
  .delete(protect, deleteCard)

router
  .route('/:cardId/comments')
  .post(protect, addComment)
  .get(protect, getComments)

router
  .route('/:cardId/comments/:commentId')
  .put(protect, updateComment)
  .delete(protect, deleteComment)

router.post('/:cardId/duplicate', protect, duplicateCard)

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
