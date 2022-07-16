// Import express
const express = require('express')
// Create router with express
const router = express.Router()

// Import controllers user
const userCtrl = require('../controllers/user')

// Route for user Signup
router.post('/signup', userCtrl.signup)
// Route for user Login
router.post('/login', userCtrl.login)

// Export router
module.exports = router