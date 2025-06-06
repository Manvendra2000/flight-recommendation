const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

async function scrapeIxigo(origin, destination, date) {
const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  const url = `https://www.ixigo.com/search/result/flight/${origin}/${destination}/${date}/1/0/0/e`;

  await page.goto(url, { waitUntil: 'domcontentloaded' });

await page.waitForSelector('.airlineInfo', { timeout: 60000 });

  const flights = await page.evaluate(() => {
 
    const data = [];
    // const cards = document.querySelectorAll('[data-testid="pricing"]');
    const cards = document.querySelectorAll('.flex.items-center.gap-5');

    cards.forEach(priceEl => {
      const card = priceEl.closest('.px-20');
      if (!card) return;

    //   const airline = card.querySelector('[data-testid="airline-logo"]')?.alt || '';
    //   const flightNumber = card.innerText.match(/[A-Z]{2}\d{3,4}/)?.[0] || '';
      const dep = card.querySelectorAll('h6')[0]?.innerText || '';
      const arr = card.querySelectorAll('h6')[1]?.innerText || '';
      const duration = card.innerText.match(/\d+h \d+m|\d+h|\d+m/)?.[0] || '';
      const price = priceEl?.innerText || '';
    // const price = card.querySelector('class="body-xs text-secondary"');
      const fullText = card.querySelector('[data-testid="airline-number"]')?.innerText || '';

    const airline = fullText.split('|')[0]?.trim();
    const flightNumber = fullText.split('|')[1]?.trim();
    const logo = card.querySelector('[class="body-sm text-primary font-medium"]')?.src || '';
    const onTime = card.innerText.match(/\d{2,3}% On-time/)?.[0] || '';
      const baggage = card.innerText.includes('Checkin') ? 'Baggage info available' : 'No baggage info found';

    //   data.push({ airline, flightNumber, dep, arr, duration, price, baggage, onTime, logo });
    data.push({ logo});
    });

    return data;
  });

  await browser.close();
  return flights;
}

// 🚀 GET /scrape?origin=DEL&destination=BOM&date=08062025
app.get('/scrape', async (req, res) => {
  const { origin, destination, date } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const results = await scrapeIxigo(origin, destination, date);
    res.json({ flights: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// const express = require('express');
// const puppeteer = require('puppeteer');
// const app = express();
// const PORT = 3000;

// async function scrapeIxigo(origin, destination, date) {
//   const browser = await puppeteer.launch({ headless: false, sloMo: 50 });
//   const page = await browser.newPage();
//   const url = `https://www.ixigo.com/search/result/flight/${origin}/${destination}/${date}/1/0/0/e`;

//   await page.goto(url, { waitUntil: 'domcontentloaded' });
// //   await page.waitForSelector('[data-testid="pricing"]', { timeout: 60000 });
// await page.waitForSelector('.flex.items-center.gap-5', { timeout: 60000 });
// try {
//     await page.waitForSelector('.flex.items-center.gap-5', { timeout: 60000 });
//   } catch {
//     return []; // return empty flight list if no cards found
//   }
//   const flights = await page.evaluate(() => {
//     const data = [];
//     // const cards = document.querySelectorAll('[data-testid="pricing"]');
//     const cards = document.querySelectorAll('.flex.items-center.gap-5');

//     cards.forEach(priceEl => {
//       const card = priceEl.closest('.px-20');
//       if (!card) return;

//       const airline = card.querySelector('[data-testid="airline-logo"]')?.alt || '';
//       const flightNumber = card.innerText.match(/[A-Z]{2}\d{3,4}/)?.[0] || '';
//       const dep = card.querySelectorAll('h6')[0]?.innerText || '';
//       const arr = card.querySelectorAll('h6')[1]?.innerText || '';
//       const duration = card.innerText.match(/\d+h \d+m|\d+h|\d+m/)?.[0] || '';
//       const price = priceEl?.innerText || '';
//       const baggage = card.innerText.includes('Checkin') ? 'Baggage info available' : 'No baggage info found';

//       // filter out incomplete entries
//       if (!airline || !flightNumber || !dep || !arr) return;

//       data.push({ airline, flightNumber, dep, arr, duration, price, baggage });
//     });

//     return data;
//   });

//   await browser.close();
//   return flights;
// }

// // GET /scrape?origin=DEL&destination=BOM&date=08062025
// app.get('/scrape', async (req, res) => {
//   const { origin, destination, date } = req.query;
//   if (!origin || !destination || !date) {
//     return res.status(400).json({ error: 'Missing parameters' });
//   }

//   try {
//     const results = await scrapeIxigo(origin, destination, date);
//     res.json({ flights: results });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Scraping failed' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });