const express = require('express')
const {
  getBoards,
  getBoard,
  createBoard,
  deleteBoard,
  updateBoard,
} = require('../controllers/boardController')
const { protect } = require('../middleware/auth')
const { checkAccess } = require('../middleware/checkAccess')
const { authorizeBoardAccess } = require('../middleware/authorizeBoardAccess')
const router = express.Router()

router.route('/').get(protect, getBoards)
router.route('/').post(protect, createBoard)

router.route('/:id').get(protect, getBoard)
router.route('/:id').delete(protect, deleteBoard)
router.route('/:id').put(protect, updateBoard)

module.exports = router
