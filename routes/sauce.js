// REQUIEREMENTS:
// Import express
const express = require('express')

// Import auth middleware
const auth = require('../middleware/auth')

// Import multer middleware config
const multer = require('../middleware/multer-config')

// Import controller
const sauceCtrl = require('../controllers/sauce')



// ROUTER:
const router = express.Router()

// Import function retrieve all objects
router.get('/', auth, sauceCtrl.getAllSauce)

// Import function creates an object
router.post('/', auth, multer, sauceCtrl.createSauce)

// Import function retrieve 1 single object
router.get('/:id', auth, sauceCtrl.getOneSauce)

// Import function modify an object
router.put('/:id', auth, multer, sauceCtrl.modifySauce)

// Import function delete an object
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce)

// Import function add like & dislike object
router.post('/:id/like', auth, sauceCtrl.likeSauce)



// Export router for app.js
module.exports = router