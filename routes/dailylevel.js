const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const config = {
  headers: {
    'User-Agent': 'Mozilla/5.0',
  }
};

router.get('/dl', (req, res) => {
  const link = req.query.link;

  if (!link) {
    return res.status(400).send('Missing link parameter');
  }

  axios.get(`${link}/tools/bot/dailyLevelBot.php`, config)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Extracting information
      const currentLevelText = $('body').text();
      const name = currentLevelText.match(/NAME:\s*([^\n]+)/)[1].replace(/[*]/g, '').trim();
      const id = currentLevelText.match(/ID:\s*([^\n]+)/)[1].replace(/[*]/g, '').trim();
      const author = currentLevelText.match(/Author:\s*([^\n]+)/)[1].replace(/[*]/g, '').trim();
      const song = currentLevelText.match(/Song:\s*([^\n]+)/)[1].replace(/[*]/g, '').trim();
      const difficulty = currentLevelText.match(/Difficulty:\s*([^\n]+)/)[1].replace(/[*]/g, '').trim();
      const dailySince = currentLevelText.match(/Daily Since:\s*([^\n]+)/)[1].replace(/[*]/g, '').trim();

      // Creating JSON response
      const jsonResponse = {
        NAME: name,
        ID: id,
        Author: author,
        Song: song,
        Difficulty: difficulty,
        Daily_Since: dailySince
      };

      res.json(jsonResponse);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    });
});

module.exports = router;
