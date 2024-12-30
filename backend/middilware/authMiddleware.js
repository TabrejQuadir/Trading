// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token format

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   console.log('Received Token:', token); // Log token for debugging

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded Token:', decoded); // Log decoded token to check
//     req.user = decoded; 
//     next(); 
//   } catch (err) {
//     console.error('Token error:', err);
//     return res.status(401).json({ message: 'Token is not valid' });
//   }
  
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error();
        }

        req.user = user; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.' });
    }
};

module.exports = authMiddleware;
