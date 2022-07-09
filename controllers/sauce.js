// Import model object
const Sauce = require('../models/sauce');
const fs = require('fs');


// Export Créer un objet
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; // Protect from injection token
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId, // get userId from token auth
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => {res.status(201).json({message: 'Objet enregistré !'})})
        .catch((error) => {res.status(400).json({error: error})}
    )
}


// Export Modifier un objet + multer protection by token
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId; // Protect from injection token
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId.toString() !== req.auth.userId) {
                res.status(403).json({message: 'unauthorized request'});
            }
            else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => {res.status(200).json({message: 'Objet modifié !'})})
                    .catch((error) => {res.status(400).json({error: error})})
            }
        })
        .catch((error) => {res.status(404).json({error: error})}
    )
}


// Export Supprimer un objet only if userId is the same as token
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId.toString() !== req.auth.userId) {
                res.status(403).json({message: 'unauthorized request'});
            }
            else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {res.status(404).json({error: error})})
}




// Export Récupérer un objet
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then((sauce) => {res.status(200).json(sauce)})
      .catch((error) => {res.status(404).json({error: error})})
}

// Export Récupérer tous les objets
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then((sauce) => {res.status(200).json(sauce)})
      .catch((error) => {res.status(400).json({error: error})})
}