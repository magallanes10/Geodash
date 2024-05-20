const express = require('express');
const https = require('https');
const router = express.Router();

router.get('/wr', (req, res) => {
  try {
    const id = req.query.id;
    const link = req.query.link;
    const userAgent = 'Mozilla/5.0';

    if (!id || !link) {
      return res.status(400).send('Missing levelId or link parameter');
    }

    const url = `${link}/tools/bot/whoRatedBot.php?level=${id}`;


    https.get(url, { headers: { 'User-Agent': userAgent } }, (response) => {
      let data = '';


      
      response.on('data', (chunk) => {
        data += chunk;
      });


      response.on('end', () => {
        const whoRated = data.trim();

        const jsonResponse = {
          id: id,
          WhoRated: whoRated
        };

        res.json(jsonResponse);
      });
    }).on('error', (error) => {
      console.error('Error fetching who rated information:', error.message);
      res.status(500).send('Internal Server Error');
    });
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
