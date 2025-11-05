const express = require('express')
const router = express.Router({ mergeParams: true })
const { protect } = require('../middleware/auth')
const { fetchBoard, checkAccess } = require('../middleware/boardMiddleware')

const {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
  getListWithCards,
} = require('../controllers/listController')

router.use(protect, fetchBoard) //all routes below require authentication

// -------------------------------
// ✅ api/v1/boards/:boardId/lists
// -------------------------------
router
  .route('/')
  .get(checkAccess({ allowOwner: true, allowCollaborator: true }), getLists)
  .post(checkAccess({ allowOwner: true, allowCollaborator: true }), createList)

// -------------------------------
// ✅ api/v1/boards/:boardId/lists/:listId
// -------------------------------
router
  .route('/:listId')
  .get(checkAccess({ allowOwner: true, allowCollaborator: true }), getList)
  .put(checkAccess({ allowOwner: true, allowCollaborator: true }), updateList)
  .delete(
    checkAccess({ allowOwner: true, allowCollaborator: false }),
    deleteList
  )

// -------------------------------
// ✅ api/v1/boards/:boardId/lists/:listId/cards
// -------------------------------
router
  .route('/:listId/cards')
  .get(
    checkAccess({ allowOwner: true, allowCollaborator: true }),
    getListWithCards
  )

module.exports = router
