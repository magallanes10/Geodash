const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/whorated', async (req, res) => {
  try {
    const levelId = req.query.id;
    const userAgent = 'Mozilla/5.0';

    const response = await axios.get(`https://gdph.ps.fhgdps.com/tools/bot/whoRatedBot.php?level=${levelId}`, {
      headers: {
        'User-Agent': userAgent
      }
    });

    const whoRated = response.data.trim();


    const jsonResponse = {
      levelID: levelId,
      WhoRated: whoRated
    };

    
    res.json(jsonResponse);

  } catch (error) {
    
    console.error('Error fetching who rated information:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
