const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', (req, res) => {
    const { url, format } = req.body;
    if (!url) return res.status(400).json({ error: 'Link gerekli' });

    // yt-dlp komutu ile indirme linkini çekiyoruz
    const command = format === 'mp3' 
        ? `yt-dlp -g -f bestaudio "${url}"`
        : `yt-dlp -g -f "best" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Video işlenemedi veya YouTube engeline takıldı.' });
        }
        const downloadUrl = stdout.trim().split('\n')[0];
        res.json({ downloadUrl });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
