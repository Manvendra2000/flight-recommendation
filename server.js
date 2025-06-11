const express = require('express');
const cors = require('cors');
const scrapeIxigo = require('./scraper');

const app = express();
app.use(cors());

app.get('/api/flights', async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    const flights = await scrapeIxigo(from, to, date);
    res.json(flights); // ✅ this sends it to frontend
  } catch (error) {
    console.error('Scraper error:', error);
    res.status(500).json({ error: 'Scraper failed', details: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});