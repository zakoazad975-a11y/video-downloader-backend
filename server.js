const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.options('*', cors());

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Link gerekli' });

    try {
        const response = await fetch('https://api.cobalt.tools/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();
        
        // Cobalt API yanıt türlerini kontrol et
        if (data.url) {
            return res.json({ downloadUrl: data.url });
        } else if (data.picker && data.picker.length > 0) {
            return res.json({ downloadUrl: data.picker[0].url });
        } else {
            return res.status(400).json({ error: data.text || 'Video indirilemedi veya bu platform desteklenmiyor.' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Sunucuya bağlanırken bir hata oluştu.' });
    }
});

module.exports = app;
