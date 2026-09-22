const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/download', (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL gereklidir.' });
    }

    // yt-dlp ile doğrudan indirme bağlantısını çekiyoruz
    const command = `npx yt-dlp-exec "${videoUrl}" -g -f "best[ext=mp4]/best"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Hata: ${error.message}`);
            return res.status(500).json({ error: 'Video bağlantısı alınamadı. Lütfen tekrar deneyin.' });
        }

        const downloadUrl = stdout.trim().split('\n')[0];
        return res.json({ url: downloadUrl });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
