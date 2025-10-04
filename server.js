const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Rate Limiting - penting untuk API Telegram :cite[8]
const telegramLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // maksimal 10 requests per menit
  message: { error: 'Too many Telegram requests, please try again later.' }
});

// // JWT Authentication Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid or expired token' });
//     req.user = user;
//     next();
//   });
// };

// Routes
// app.use('/api/telegram', telegramLimiter, authenticateToken, require('./routes/telegram'));
app.use('/api/telegram', require('./routes/telegram'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`SMARTIFUS Backend running on port ${PORT}`);
});

// Endpoint testing tanpa authentication
app.post('/api/test/telegram', async (req, res) => {
    try {
        const { weight, timestamp } = req.body;
        
        console.log('🔧 TEST MODE - Telegram Alert:');
        console.log(`Weight: ${weight}g, Time: ${timestamp}`);
        
        // Simulasi response sukses
        res.json({
            success: true,
            message: 'TEST MODE - Alert would be sent to Telegram',
            simulated: true,
            data: { weight, timestamp }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});