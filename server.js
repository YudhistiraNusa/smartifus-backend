const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const initializeFirebaseAdmin = require('./config/firebase-admin');
initializeFirebaseAdmin();

app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'], // URL frontend lokal
    methods: ['GET', 'POST'],
    credentials: true
}));

// // Middleware
// app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
// app.use(express.json());

// Rate Limiting - penting untuk API Telegram :cite[8]
const telegramLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // maksimal 10 requests per menit
  message: { error: 'Too many Telegram requests, please try again later.' }
});

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


// testing firebase
const admin = require('firebase-admin');

app.get('/test-firebase', async (req, res) => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('test').limit(1).get();
    res.json({ success: true, count: snapshot.size });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// ...existing code...