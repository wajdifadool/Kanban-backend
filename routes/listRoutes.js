const express = require('express')
const {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
} = require('../controllers/listController')

const { protect } = require('../middleware/auth')
const { getListMiddleware } = require('../middleware/getListMiddleware')

const { getBoardMiddleware } = require('../middleware/getBoardMiddleware')

const { verifyBoardMember } = require('../middleware/verifyBoardAccess')
const { isMemberinBoard } = require('../middleware/isMember')
// mergeParams: true → allows us to access params from parent routes
// Example: if mounted under /api/v1/boards/:boardId/lists
// we can access req.params.boardId inside these routes
const router = express.Router({ mergeParams: true })

/* -------------------------------------------------------------------------- */
/* 
  ROUTE CONTEXT EXPLANATION:
  This router is mounted in server.js twice:
  
  1️⃣ app.use('/api/v1/lists', listRoutes)
      → Handles global list routes (e.g., /api/v1/lists, /api/v1/lists/:id)
      → req.params.boardId will be undefined

  2️⃣ app.use('/api/v1/boards/:boardId/lists', listRoutes)
      → Handles board-specific nested routes (e.g., /api/v1/boards/123/lists)
      → req.params.boardId will contain the parent board's ID
*/
/* -------------------------------------------------------------------------- */

// @desc    Get all lists OR lists under a specific board
// @route   GET /api/v1/lists
// @route   GET /api/v1/boards/:boardId/lists
// @access  Private
//
// @desc    Create a list under a specific board
// @route   POST /api/v1/boards/:boardId/lists
// @access  Private
// TODO: Enahnce repsonse message
router.route('/').get(protect, getBoardMiddleware, isMemberinBoard, getLists)
router.route('/').post(protect, getBoardMiddleware, isMemberinBoard, createList)

// @route   GET, DELETE, PUT  /api/v1/lists/:id
// @access  Private

router.route('/:id').get(
  protect,
  //
  getListMiddleware,
  verifyBoardMember('view this list'),
  getList
)

router
  .route('/:id')
  .put(
    protect,
    getListMiddleware,
    verifyBoardMember('update this list'),
    updateList
  )

router
  .route('/:id')
  .delete(
    protect,
    getListMiddleware,
    verifyBoardMember('delete this list'),
    deleteList
  )

module.exports = router
