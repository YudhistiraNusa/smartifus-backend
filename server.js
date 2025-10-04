// const express = require('express');
// const cors = require('cors');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
// app.use(express.json());

// // Rate Limiting - penting untuk API Telegram :cite[8]
// const telegramLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 10, // maksimal 10 requests per menit
//   message: { error: 'Too many Telegram requests, please try again later.' }
// });

// app.use('/api/telegram', require('./routes/telegram'));

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// app.listen(PORT, () => {
//   console.log(`SMARTIFUS Backend running on port ${PORT}`);
// });

// // Endpoint testing tanpa authentication
// app.post('/api/test/telegram', async (req, res) => {
//     try {
//         const { weight, timestamp } = req.body;
        
//         console.log('🔧 TEST MODE - Telegram Alert:');
//         console.log(`Weight: ${weight}g, Time: ${timestamp}`);
        
//         // Simulasi response sukses
//         res.json({
//             success: true,
//             message: 'TEST MODE - Alert would be sent to Telegram',
//             simulated: true,
//             data: { weight, timestamp }
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

const express = require('express');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 3000; // ← PASTIKAN pakai environment variable

// ... kode middleware dan routes ...

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Tambahkan di server.js - handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 UNCAUGHT EXCEPTION:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
    process.exit(1);
});