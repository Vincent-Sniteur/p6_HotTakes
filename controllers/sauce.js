// Import model object
const Sauce = require('../models/sauce')
const fs = require('fs')


// Export create an object & add userId per object for security check
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    delete sauceObject._userId // Protect from injection token
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId, // Get userId from token auth
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    sauce.save()
        .then(() => {res.status(201).json({message: 'Objet enregistré !'})})
        .catch((error) => {res.status(400).json({error: error})}
    )
}


// Export modify an object, if userId is the same as token
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete sauceObject._userId // Protect from injection token
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId.toString() !== req.auth.userId) {
                res.status(403).json({message: 'unauthorized request'})
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


// Export delete object, if userId is the same as token
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId.toString() !== req.auth.userId) {
                res.status(403).json({message: 'unauthorized request'})
            }
            else {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`/images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch((error) => {res.status(404).json({ error })})
}



// Export retrieve all objects
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then((sauce) => {res.status(200).json(sauce)})
      .catch((error) => {res.status(400).json({ error })})
}


// Export retrieve an object
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then((sauce) => {res.status(200).json(sauce)})
      .catch((error) => {res.status(404).json({ error })})
}



// Export system like & dislike object
exports.likeSauce = (req, res, next) => {
    const like = req.body.like
    const idSauce = req.params.id
    
    Sauce.findOne({ _id: idSauce })

    .then (sauce => {
        // Check If user already like the sauce
        const includesId = !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)

        // Like the sauce if user not already liked or disliked return 1 & add userId to usersLiked increment by 1 like
        if( like === 1 && includesId ) {
            // Push userId in usersLiked array & increment likes
            Sauce.updateOne({_id:idSauce}, {$push: {usersLiked: req.body.userId}, $inc: {likes: +1}})

            .then(() => res.status(200).json({ message: 'Like added'}))
            .catch(error => res.status(400).json({ error }))
        }

        // Dislike sauce if user not already liked or disliked return -1 & add userId to usersdisLiked increment by 1 dislike
        else if( like === -1 && includesId ) {
            // Push userId in usersDisliked array & increment dislikes
            Sauce.updateOne({_id:idSauce}, {$push: {usersDisliked: req.body.userId}, $inc: {dislikes: +1}})

            .then(() => res.status(200).json({ message: 'Dislike added'}))
            .catch(error => res.status(400).json({ error }))
        }

        // Delete like already exist & decrement likes & delete userId from usersLiked
        else {
            if(sauce.usersLiked.includes(req.body.userId)) {
            // Remove userId from usersLiked array & decrement likes
                Sauce.updateOne({_id:idSauce}, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})

                .then(() => res.status(200).json({ message: 'Like remote'}))
                .catch(error => res.status(400).json({ error }))
            }
        // Delete dislike already exist & decrement dislikes & delete userId from usersDisliked
            else if(sauce.usersDisliked.includes(req.body.userId)) {
            // Remove userId from usersDisliked array & decrement dislikes
                Sauce.updateOne({_id:idSauce}, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})

                .then(() => res.status(200).json({ message: 'Dislike remote'}))
                .catch(error => res.status(400).json({ error }))
            }
        }
    })
    .catch(error => res.status(400).json({ error }))
}