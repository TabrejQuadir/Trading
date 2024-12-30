const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminSchema');

exports.adminAuth = async (req, res, next) => {
    try {
        // Get token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        console.log("Authorization Header:", req.header('Authorization'));
        console.log("Token:", token);

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ _id: decoded.userId });

        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        // Attach user and role info to the request object for route handling
        req.user = admin;
        req.userId = decoded.userId;
        req.role = admin.role;

        // Allow all authenticated admins to proceed
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        res.status(401).json({ message: 'Invalid token. Please authenticate as an admin.' });
    }
};
