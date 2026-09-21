const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.options('*', cors());

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Lütfen geçerli bir bağlantı girin.' });

    // Alternatif Cobalt API sunucuları (Birinde IP engeli varsa diğerine geçer)
    const instances = [
        'https://api.cobalt.tools',
        'https://cobalt-api.kwippy.me',
        'https://api.v1.cobalt.tools'
    ];

    for (const instance of instances) {
        try {
            const response = await fetch(instance, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });

            if (!response.ok) continue;

            const data = await response.json();

            // Dönüş formatlarını kontrol et
            if (data.url) {
                return res.json({ downloadUrl: data.url });
            } else if (data.picker && data.picker.length > 0) {
                return res.json({ downloadUrl: data.picker[0].url });
            } else if (data.status === 'stream' || data.status === 'redirect') {
                return res.json({ downloadUrl: data.url });
            }
        } catch (e) {
            console.error(`Sunucu hatası (${instance}):`, e);
        }
    }

    return res.status(500).json({ error: 'Video indirilemedi veya servisler yoğun. Lütfen farklı bir link ile tekrar deneyin.' });
});

module.exports = app;
