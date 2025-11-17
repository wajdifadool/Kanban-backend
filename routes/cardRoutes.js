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
  updateChecklistItem,
  deleteChecklistItem,
  getAllCardCheckListItems,
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

router.route('/:cardId/attachments').post(protect, uploadFileToCard)
router
  .route('/:cardId/attachments/:attachmentId')
  .delete(protect, deleteAttachment)

// some commit
router.route('/:cardId/checklist').post(fetchCard, addChecklistItem)
router.route('/:cardId/checklist/:itemId').put(fetchCard, updateChecklistItem)
router
  .route('/:cardId/checklist/:itemId')
  .delete(fetchCard, deleteChecklistItem)

router.route('/:cardId/checklist').get(fetchCard, getAllCardCheckListItems)

module.exports = router
