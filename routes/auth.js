const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  updateDetails,
  updatePassword,
  forgetpassword,
  resetPassword,
  googleAuthRequest,
  googleAuthRedirect,
  googleAuthCallback,
} = require('../controllers/auth')

const { protect } = require('../middleware/auth')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgetpassword', forgetpassword)
router.route('/resetpassword/:resettoken').put(resetPassword)

// GOOGLE AUTH
router.get('/google/login', googleAuthRedirect) //Step 1
router.get('/google', googleAuthRequest) // step 2: google middleware
router.get('/google/callback', googleAuthCallback) // step 3 : google  callback will get a token

module.exports = router
