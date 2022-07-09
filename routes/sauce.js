const express = require('express');
const router = express.Router();

// Import auth middleware
const auth = require('../middleware/auth');

// import model
const multer = require('../middleware/multer-config');

// import controller
const stuffCtrl = require('../controllers/sauce');


// Import fonction récupérer tous les objets
router.get('/', auth, stuffCtrl.getAllSauce);

// Import fonction crée un objet
router.post('/', auth, multer, stuffCtrl.createSauce);

// Import fonction récupérer 1 seul objet
router.get('/:id', auth, stuffCtrl.getOneSauce);

// Import fonction modiffier un objet
router.put('/:id', auth, multer, stuffCtrl.modifySauce);

// Import fonction supprimer un objet
router.delete('/:id', auth, multer, stuffCtrl.deleteSauce);


module.exports = router;