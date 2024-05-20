const express = require('express');
const https = require('https');
const router = express.Router();

router.get('/player', (req, res) => {
    try {
        const user = req.query.user;
        const link = req.query.link;
        const userAgent = 'Mozilla/5.0';

        if (!user || !link) {
            return res.status(400).send('Missing user or link parameter');
        }

        const url = `${link}/tools/bot/playerStatsBot.php?player=${user}`;

        https.get(url, { headers: { 'User-Agent': userAgent } }, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const playerInfo = extractPlayerInfo(data);
                res.json(playerInfo);
            });
        }).on('error', (error) => {
            console.error('Error fetching player information:', error.message);
            res.status(500).send('Internal Server Error');
        });
    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

function extractPlayerInfo(data) {
    const info = {};
    const lines = data.split('\n');
    const regex = /\*\*([^:]+):\*\*\s*([^*]+)/;

    lines.forEach(line => {
        if (!line.includes('------------------------------------') && line.trim() !== '') {
            const match = line.match(regex);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                info[key] = value;
            }
        }
    });

    return info;
}

module.exports = router;