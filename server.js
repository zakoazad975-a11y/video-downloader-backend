const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Geçerli bir YouTube bağlantısı girin.' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });

        if (format && format.url) {
            return res.json({ url: format.url });
        } else {
            return res.status(404).json({ error: 'İndirme bağlantısı bulunamadı.' });
        }
    } catch (error) {
        console.error('Hata:', error);
        return res.status(500).json({ error: 'Video işlenirken bir hata oluştu.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
