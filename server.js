const express = require('express');
const cors = require('cors');
const app = express();

// Tüm sitelerden ve frontend'den gelen isteklere izin ver (CORS)
app.use(cors({ origin: '*' }));
app.use(express.json());

app.options('*', cors());

// Ana dizin testi için
app.get('/', (req, res) => {
    res.send('Backend Sunucusu Aktif!');
});

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Lütfen geçerli bir bağlantı girin.' });

    // Alternatif Cobalt API sunucuları
    const instances = [
        'https://api.cobalt.tools',
        'https://cobalt-api.kwippy.me',
        'https://api.v1.cobalt.tools',
        'https://co.wuk.sh'
    ];

    for (const instance of instances) {
        try {
            const response = await fetch(`${instance}/api/json`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });

            if (!response.ok) continue;

            const data = await response.json();

            if (data.url) {
                return res.json({ downloadUrl: data.url });
            } else if (data.picker && data.picker.length > 0) {
                return res.json({ downloadUrl: data.picker[0].url });
            }
        } catch (e) {
            console.error(`Sunucu hatası (${instance}):`, e);
        }
    }

    return res.status(500).json({ error: 'Video indirilemedi veya servisler yoğun. Başka bir bağlantı deneyin.' });
});

module.exports = app;
