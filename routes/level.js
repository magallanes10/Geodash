const express = require('express');
const https = require('https');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/levelinfo', (req, res) => {
    try {
        const level = req.query.level;
        const link = req.query.link;
        const userAgent = 'Mozilla/5.0';

        if (!level || !link) {
            return res.status(400).send('Missing level or link parameter');
        }

        const url = `${link}/tools/bot/levelSearchBot.php?str=${level}`;

        // Make GET request to the external API using native https module
        https.get(url, { headers: { 'User-Agent': userAgent } }, (response) => {
            let data = '';

            // Collect the data chunks
            response.on('data', (chunk) => {
                data += chunk;
            });

            // When the whole response is received, process it
            response.on('end', () => {
                const $ = cheerio.load(data);

                // Extract and clean the name
                let name = $('**').filter((index, element) => $(element).text().includes('NAME')).text().split(':')[1]?.trim().replace(/\*/g, '');
                if (name) {
                    // Remove the unwanted '\nID' part
                    name = name.replace(/\nID$/, '');
                }

                const levelInfo = {};
                $('**').each((index, element) => {
                    const key = $(element).text().split(':')[0].trim();
                    const value = $(element).text().split(':')[1]?.trim().replace(/\*/g, '');
                    if (key && value && key !== 'SHOWING RESULT FOR' && key !== 'Rated by' && key !== 'OBJECTS') {
                        levelInfo[key] = value;
                    }
                });

                const additionalInfo = extractLevelInfo(data);

                const mergedInfo = { ...levelInfo, ...additionalInfo };

                const modifiedInfo = {
                    name: name,
                    ID: mergedInfo["ID"],
                    Author: mergedInfo["Author"],
                    Song: mergedInfo["Song"],
                    Difficulty: mergedInfo["Difficulty"],
                    Coins: mergedInfo["Coins"],
                    Length: mergedInfo["Length"],
                    "Upload Time": mergedInfo["Upload Time"],
                    "Update Time": mergedInfo["Update Time"],
                    Objects: mergedInfo["Objects"],
                    "Level Version": mergedInfo["Level Version"],
                    "Game Version": mergedInfo["Game Version"],
                    Downloads: mergedInfo["Downloads"],
                    Likes: mergedInfo["Likes"]
                };

                res.json(modifiedInfo);
            });
        }).on('error', (error) => {
            console.error('Error fetching level information:', error.message);
            res.status(500).send('Internal Server Error');
        });
    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

function extractLevelInfo(data) {
    const info = {};
    const regex = /\*\*([^:]+):\*\*\s*([^*]+)/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (key !== 'SHOWING RESULT FOR' && key !== 'Rated by') {
            info[key] = value.replace(/\*+/g, '');
        }
    }
    return info;
}

module.exports = router;
