const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    //console.log(authHeader)


    if (!authHeader) {
        return res.json({ message: 'Authentication token required' });
    }

    const token = authHeader;

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.json({status:400,  message: 'login first',loginStatus:0 });
        }
        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;
