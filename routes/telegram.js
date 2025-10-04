const express = require('express');
const router = express.Router();

router.post('/send-alert', async (req, res) => {
    try {
        const { weight, timestamp } = req.body;
        
        // Pastikan variabel environment sudah diset di Railway
        const chatId = process.env.TELEGRAM_CHAT_ID; // Contoh: '123456789'
        const botToken = process.env.TELEGRAM_BOT_TOKEN; // Contoh: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'

        if (!chatId || !botToken) {
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram configuration missing. Check environment variables.' 
            });
        }

        // ... kode pengiriman pesan Anda yang sudah ada ...
        const message = `⚠️ **PERINGATAN DINI SMARTIFUS** ⚠️\n` +
                       `Berat Infus: ${weight}g\n` +
                       `Status: HAMPIR HABIS\n` +
                       `Waktu: ${timestamp}\n` +
                       `Segera ganti infus!`;

        const payload = { chat_id: chatId, text: message, parse_mode: 'Markdown' };
        // ... sisa kode fetch ke API Telegram ...

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;