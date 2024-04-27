const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/levelinfo', async (req, res) => {
    try {
        const level = req.query.level;
        const userAgent = 'Mozilla/5.0';

        const response = await axios.get(`https://gdph.ps.fhgdps.com/tools/bot/levelSearchBot.php?str=${level}`, {
            headers: {
                'User-Agent': userAgent
            }
        });

        const $ = cheerio.load(response.data);

        
        const name = $('**').filter((index, element) => $(element).text().includes('NAME')).text().split(':')[1]?.trim().replace(/\*/g, '');

        const levelInfo = {};
        $('**').each((index, element) => {
            const key = $(element).text().split(':')[0].trim();
            const value = $(element).text().split(':')[1]?.trim().replace(/\*/g, '');
            if (key && value && key !== 'SHOWING RESULT FOR' && key !== 'Rated by' && key !== 'OBJECTS') {
                levelInfo[key] = value;
            }
        });

        const additionalInfo = extractLevelInfo(response.data);

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
    } catch (error) {
        
        console.error('Error fetching level information:', error.message);
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
