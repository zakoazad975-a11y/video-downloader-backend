const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Link gerekli' });

    try {
        const response = await fetch(`https://api.cobalt.tools/api/json`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });
        const data = await response.json();
        
        if (data.url) {
            res.json({ downloadUrl: data.url });
        } else {
            res.status(400).json({ error: 'Video indirilemedi veya link geçersiz.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası oluştu.' });
    }
});

module.exports = app;
