// jwt token verification middleware
require("dotenv").config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        const tokenHeader = req.headers['authorization']; 

        if (!tokenHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = tokenHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }
        // console.log(token);
        // console.log(SECRET_KEY);

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token not verified or expired' });
            }

            req.user = user; 
            next();
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
};

module.exports = verifyToken;
