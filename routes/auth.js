const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  updateDetails,
  updatePassword,
} = require('../controllers/auth')

const { protect } = require('../middleware/auth')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)

module.exports = router
