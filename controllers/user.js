// import bcrypt
const bcrypt = require('bcrypt');

// import model User
const User = require('../models/user');

// import jwt
const jwt = require('jsonwebtoken');


// Singnup export
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 10 = nombre de fois que le mot de passe est hashé
        .then(hash => { // Create new user & hash password
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save() // Save user in database
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // error server
}





// Login export
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Find user by email
        .then(user => {
            if (user === null) { // If user not found & return error message for no leak information
                return res.status(401).json({ message: 'Identifiant & mot de passe incorrecte.' });
            }
            else {
                bcrypt.compare(req.body.password, user.password) // Compare password with hash
                .then(valid => {
                    if (!valid) { // If password not valid & return error message for no leak information
                        return res.status(401).json({ message: 'Identifiant & mot de passe incorrecte.' });
                    }
                    res.status(200).json({ // If password valid
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }) // Create token with userId and expires in 24h
                    });
                })
                .catch(error => res.status(500).json({ error })); // error server
        }
    })
        .catch(error => res.status(500).json({ error })); // error server
}