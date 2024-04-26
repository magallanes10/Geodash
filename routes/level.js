const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/levelinfo', async (req, res) => {
    try {
        const level = req.query.level;
        const userAgent = 'Mozilla/5.0';
      // User-Agent header to mimic Mozilla browser

        // Make GET request to the external API
        const response = await axios.get(`https://gdph.ps.fhgdps.com/tools/bot/levelSearchBot.php?str=${level}`, {
            headers: {
                'User-Agent': userAgent
            }
        });

        // Extract specific information from the response
        const levelInfo = extractLevelInfo(response.data);

        // Send the level information as JSON response
        res.json(levelInfo);
    } catch (error) {
        // Handle any errors
        console.error('Error fetching level information:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Function to extract specific information from the response
function extractLevelInfo(data) {
    const info = {};
    const regex = /\*\*([^:]+):\*\*\s*([^*]+)/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        info[key] = value;
    }
    return info;
}

module.exports = router;
