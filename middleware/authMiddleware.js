const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from 'Bearer' header
    console.log("token",token)
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token ",decodedToken);
        req.userId = decodedToken.id; // Extract the user ID from the token and add to request object

        next(); // Proceed to the next middleware
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};



module.exports = authMiddleware;
