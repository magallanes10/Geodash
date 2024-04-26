const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/player', async (req, res) => {
    try {
        const user = req.query.user;
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'; // User-Agent header to mimic Mozilla browser

        // Make GET request to the external API
        const response = await axios.get(`https://gdph.ps.fhgdps.com/tools/bot/playerStatsBot.php?player=${user}`, {
            headers: {
                'User-Agent': userAgent
            }
        });

        // Extract specific information from the response
        const playerInfo = extractPlayerInfo(response.data);

        // Send the player information as JSON response
        res.json(playerInfo);
    } catch (error) {
        // Handle any errors
        console.error('Error fetching player information:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Function to extract specific information from the response
function extractPlayerInfo(data) {
    const info = {};
    const regex = /\*\*([^:]+):\*\*\s*([^*]+)/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        // Ignore lines containing only hyphens
        if (value !== '------------------------------------') {
            info[key] = value;
        }
    }
    return info;
}

module.exports = router;
