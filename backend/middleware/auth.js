const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];


    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    const token = authHeader;

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({satus:400,  message: 'Invalid or expired token',loginStatus:0 });
        }
        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;
