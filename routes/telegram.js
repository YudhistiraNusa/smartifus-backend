const express = require('express');
const router = express.Router();

router.post('/send-alert', async (req, res) => {
  // === LOG 1: Konfirmasi Endpoint Terpanggil ===
  console.log("🔔 Endpoint /send-alert diterima. Data:", req.body);

  try {
    const { weight, timestamp } = req.body;

    // === LOG 2: Cek Environment Variables ===
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    console.log("🔧 Mengecek environment variables...");
    console.log("   - TELEGRAM_CHAT_ID tersedia?", !!chatId);
    console.log("   - TELEGRAM_BOT_TOKEN tersedia?", !!botToken);

    if (!chatId || !botToken) {
      console.error("❌ Environment variables tidak lengkap!");
      return res.status(500).json({ 
        success: false, 
        error: 'Telegram configuration missing' 
      });
    }

    const message = `⚠️ **PERINGATAN DINI SMARTIFUS** ⚠️\n` +
                   `Nama Pasien : Aufa ganteng\n` +
                   `Berat Infus: ${weight}g\n` +
                   `Status: HAMPIR HABIS\n` +
                   `Waktu: ${timestamp}\n` +
                   `Segera ganti infus!`;

    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    };

    // === LOG 3: Request akan Dikirim ===
    console.log("📤 Mengirim request ke Telegram API...");
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // === LOG 4: Response dari Telegram ===
    console.log(`📨 Status Response: ${response.status}`);
    const responseData = await response.json();
    console.log("   - Body Response:", JSON.stringify(responseData));

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status} - ${responseData.description}`);
    }

    // === LOG 5: Sukses ===
    console.log("✅ Pesan berhasil dikirim ke Telegram!");
    res.json({
      success: true,
      message: 'Alert sent successfully',
      messageId: responseData.result.message_id
    });

  } catch (error) {
    // === LOG 6: Error Detail ===
    console.error("❌ Error dalam proses pengiriman:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;