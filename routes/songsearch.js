const express = require('express');
const https = require('https');
const router = express.Router();

router.get('/ss', (req, res) => {
    try {
        const link = req.query.link;
        const songname = req.query.songname;
        const userAgent = 'Mozilla/5.0';

        if (!link || !songname) {
            return res.status(400).send('Missing songname or link parameter');
        }

        const url = `${link}/tools/bot/songSearchBot.php?str=${songname}`;

        // Make GET request to the external API using native https module
        https.get(url, { headers: { 'User-Agent': userAgent } }, (response) => {
            let data = '';

            // Collect the data chunks
            response.on('data', (chunk) => {
                data += chunk;
            });

            // When the whole response is received, process it
            response.on('end', () => {
                const songs = extractSongsInfo(data);
                res.json(songs);
            });
        }).on('error', (error) => {
            console.error('Error fetching song information:', error.message);
            res.status(500).send('Internal Server Error');
        });
    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

function extractSongsInfo(data) {
    const songs = [];
    const regex = /\*\*(\d+)\s*:\s*\*\*(.*?)\s*\*\*\d+\s*:\s*\*\*[^*]+\s*[^*]*/g;
    let match;

    while ((match = regex.exec(data)) !== null) {
        const song = {
            idsong: match[1],
            songname: match[2].trim()
        };
        songs.push(song);
    }

    return songs;
}

module.exports = router;
