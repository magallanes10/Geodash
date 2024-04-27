const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/player', async (req, res) => {
    try {
        const user = req.query.user;
        const userAgent = 'Mozilla/5.0';

        // Make GET request to the external API
        const response = await axios.get(`https://gdph.ps.fhgdps.com/tools/bot/playerStatsBot.php?player=${user}`, {
            headers: {
                'User-Agent': userAgent
            }
        });

        
        const playerInfo = extractPlayerInfo(response.data);

        res.json(playerInfo);
    } catch (error) {
        
        console.error('Error fetching player information:', error.message);
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
