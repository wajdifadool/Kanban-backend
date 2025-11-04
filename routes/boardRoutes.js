const express = require('express')
const {
  getBoards,
  getBoard,
  createBoard,
  deleteBoard,
  updateBoard,
  addMember,
  removeMember,
} = require('../controllers/boardController')
const { protect } = require('../middleware/auth')
const { fetchBoard, checkAccess } = require('../middleware/boardMiddleware')

const router = express.Router()

// -------------------------------
// ✅ Public routes
// -------------------------------
router.use(protect) // all routes below require authentication

// -------------------------------
// ✅ Board CRUD
// -------------------------------
router
  .route('/')
  //
  .get(getBoards)
  .post(createBoard)

router
  .route('/:id')
  .get(
    fetchBoard,
    checkAccess({ allowOwner: true, allowCollaborator: true }),
    getBoard
  )
  .delete(
    fetchBoard,
    checkAccess({ allowOwner: true, allowCollaborator: false }),
    deleteBoard
  )
  .put(
    fetchBoard,
    checkAccess({ allowOwner: true, allowCollaborator: true }),
    updateBoard
  )

// -------------------------------
// ✅ Board Members
// -------------------------------
router
  .route('/:id/members')
  .post(
    fetchBoard,
    checkAccess({ allowOwner: true, allowCollaborator: true }),
    addMember
  )
  .delete(
    fetchBoard,
    checkAccess({ allowOwner: true, allowCollaborator: true }),
    removeMember
  )

module.exports = router
