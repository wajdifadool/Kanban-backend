const express = require('express')
const {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
} = require('../controllers/listController')

const { protect } = require('../middleware/auth')
const {
  getListMiddleware,
  getCardsForListMiddleware,
} = require('../middleware/getListMiddleware')

const { getBoardMiddleware } = require('../middleware/getBoardMiddleware')

const { verifyBoardMember } = require('../middleware/verifyBoardAccess')
const { isMemberinBoard } = require('../middleware/isMember')
// mergeParams: true → allows us to access params from parent routes
// Example: if mounted under /api/v1/boards/:boardId/lists
// we can access req.params.boardId inside these routes
const router = express.Router({ mergeParams: true })

// @routes   GET, POST /api/v1/boards/:boardId/lists
router.route('/').get(protect, getBoardMiddleware, isMemberinBoard, getLists)
router.route('/').post(protect, getBoardMiddleware, isMemberinBoard, createList)
/*
TODO: Enahnce repsonse message 
*/

// @routes   GET, DELETE, PUT  /api/v1/lists/:id
router
  .route('/:id')
  .get(protect, getListMiddleware, verifyBoardMember('view this list'), getList)

router
  .route('/:id/cards')
  .get(
    protect,
    getListMiddleware,
    getCardsForListMiddleware,
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
