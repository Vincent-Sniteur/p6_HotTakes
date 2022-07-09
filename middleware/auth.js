// import jwt
const jwt = require('jsonwebtoken');

// Config auth token for access to middleware
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Get token from header & split by space
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Verify token with secret
        const userId = decodedToken.userId; // Get userId from token
        req.auth = { userId }; // Add userId to request
        next(); // Go to next middleware
    } catch (error) {
        res.status(401).json({ message: 'Vous n\'êtes pas autorisé.' + error });
    }
}