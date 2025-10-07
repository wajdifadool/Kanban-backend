const express = require('express')
const {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  duplicateCard,
  addComment,
  deleteComment,
  updateComment,
  getComments,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} = require('../controllers/cardController')

const { protect } = require('../middleware/auth')

// mergeParams: true allows this router to read boardId and listId from parent routes
const router = express.Router({ mergeParams: true })

/* -------------------------------------------------------------------------- */
/* ROUTE CONTEXT:
   Mounted from server.js as:
   app.use('/api/v1/cards', cardRoutes)
   app.use('/api/v1/boards/:boardId/lists/:listId/cards', cardRoutes)
   So req.params.boardId or req.params.listId may or may not exist.
*/
/* -------------------------------------------------------------------------- */

// @desc    Get all cards OR cards in a specific list
// @route   GET /api/v1/cards
// @route   GET /api/v1/boards/:boardId/lists/:listId/cards

// @access  Private
router.route('/').get(protect, getCards)
router.route('/').post(protect, createCard)

// @desc    Get, update, or delete single card
// @route   GET    /api/v1/cards/:id
// @route   PUT    /api/v1/cards/:id
// @route   DELETE /api/v1/cards/:id
router
  .route('/:id')
  .get(protect, getCard)
  .put(protect, updateCard)
  .delete(protect, deleteCard)

router.post('/:cardId/duplicate', protect, duplicateCard)

// @route   POST /api/v1/cards/:cardId/duplicate
/* ---------------------- Nested Routes: Comments ---------------------- */

// @desc    Add a comment to a card
// @route   POST /api/v1/cards/:cardId/comments
// @access  Private
router.route('/:cardId/comments').post(protect, addComment)
router.route('/:cardId/comments').get(protect, getComments)

router.route('/:cardId/comments/:commentId').put(protect, updateComment)

// @desc    Delete a comment
// @route   DELETE /api/v1/cards/:cardId/comments/:commentId
// @access  Private
router.route('/:cardId/comments/:commentId').delete(protect, deleteComment)

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

module.exports = router
