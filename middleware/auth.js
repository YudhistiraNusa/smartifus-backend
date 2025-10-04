const jwt = require('jsonwebtoken');

const generateToken = (userId, userRole = 'user') => {
    return jwt.sign(
        { 
            userId, 
            role: userRole,
            timestamp: Date.now()
        }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: '24h',
            issuer: 'smartifus-api',
            audience: 'smartifus-web'
        }
    );
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: 'Access token required' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                error: 'Invalid or expired token' 
            });
        }

        req.user = decoded;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            error: 'Admin access required' 
        });
    }
    next();
};

module.exports = {
    generateToken,
    verifyToken,
    requireAdmin
};