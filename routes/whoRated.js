const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/whorated', async (req, res) => {
    try {
        const levelId = req.query.id;
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'; // User-Agent header to mimic Mozilla browser

        // Make GET request to the external API
        const response = await axios.get(`https://gdph.ps.fhgdps.com/tools/bot/whoRatedBot.php?level=${levelId}`, {
            headers: {
                'User-Agent': userAgent
            }
        });

        // Extract specific information from the response
        const whoRated = extractWhoRated(response.data);

        // Send the who rated information as JSON response
        res.json({
            levelID: levelId,
            WhoRated: whoRated
        });
    } catch (error) {
        // Handle any errors
        console.error('Error fetching who rated information:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Function to extract specific information from the response
function extractWhoRated(data) {
    // Extract the name of the rater
    const regex = /(\b[A-Z][a-z]* [A-Z][a-z]*\b) did!/g;
    const match = regex.exec(data);
    if (match) {
        return match[1];
    } else {
        return 'No one has rated this level yet.';
    }
}

module.exports = router;
