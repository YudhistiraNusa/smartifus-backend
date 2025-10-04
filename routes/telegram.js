const express = require('express');
const router = express.Router();

// Retry mechanism untuk handle rate limits :cite[8]
const sendWithRetry = async (payload, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.ok) {
        return { success: true, data: data.result };
      }

      // Jika rate limit, tunggu sebelum retry
      if (data.error_code === 429) {
        const retryAfter = data.parameters?.retry_after || 2;
        console.log(`Rate limited, retrying after ${retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      return { success: false, error: data.description };

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        return { success: false, error: error.message };
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Endpoint untuk send alert
router.post('/send-alert', async (req, res) => {
  try {
    const { weight, timestamp, chatId } = req.body;

    if (!weight || !timestamp) {
      return res.status(400).json({ error: 'Weight and timestamp are required' });
    }

    const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;
    
    if (!targetChatId) {
      return res.status(500).json({ error: 'Telegram chat ID not configured' });
    }

    const message = `⚠️ **PERINGATAN DINI SMARTIFUS** ⚠️\n` +
                   `Berat Infus: ${weight}g\n` +
                   `Status: HAMPIR HABIS\n` +
                   `Waktu: ${timestamp}\n` +
                   `Segera ganti infus!`;

    const payload = {
      chat_id: targetChatId,
      text: message,
      parse_mode: 'Markdown'
    };

    const result = await sendWithRetry(payload);

    if (result.success) {
      // Log successful delivery
      console.log(`Telegram alert sent successfully to chat ${targetChatId}`);
      res.json({ 
        success: true, 
        message: 'Alert sent successfully',
        messageId: result.data.message_id
      });
    } else {
      console.error('Failed to send Telegram alert:', result.error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send Telegram alert',
        details: result.error
      });
    }

  } catch (error) {
    console.error('Error in send-alert endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;