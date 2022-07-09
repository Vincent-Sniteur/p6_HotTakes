const express = require('express');
const router = express.Router();

// Import auth middleware
const auth = require('../middleware/auth');

// Import multer middleware config
const multer = require('../middleware/multer-config');

// Import controller
const sauceCtrl = require('../controllers/sauce');


// Import fonction récupérer tous les objets
router.get('/', auth, sauceCtrl.getAllSauce);

// Import fonction crée un objet
router.post('/', auth, multer, sauceCtrl.createSauce);

// Import fonction récupérer 1 seul objet
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Import fonction modiffier un objet
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Import fonction supprimer un objet
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);


module.exports = router;