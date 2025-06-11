const puppeteer = require('puppeteer');

async function scrapeIxigo(origin, destination, date) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = `https://www.ixigo.com/search/result/flight/${origin}/${destination}/${date}/1/0/0/e`;

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise(resolve => setTimeout(resolve, 5000));
  // Update: Wait for a real, reliable selector
  await page.waitForSelector('[data-testid="pricing"]');

  const flights = await page.evaluate(() => {
    const data = [];
    const cards = document.querySelectorAll('[data-testid="pricing"]');

    cards.forEach(priceEl => {
      const card = priceEl.closest('.px-20');
      if (!card) return;

      const airline = card.querySelector('[data-testid="airline-logo"]')?.alt || '';
      const flightNumber = card.innerText.match(/AI\d{3,4}/)?.[0] || '';
      const dep = card.querySelectorAll('h6')[0]?.innerText || '';
      const arr = card.querySelectorAll('h6')[1]?.innerText || '';
      const duration = card.innerText.match(/\d+h \d+m|\d+h|\d+m/)?.[0] || '';
      const price = priceEl?.innerText || '';
      const baggage = card.innerText.includes('Checkin') ? 'Baggage info available' : 'No baggage info found';

      data.push({ airline, flightNumber, dep, arr, duration, price, baggage });
    });

    return data;
  });

  await browser.close();
  return flights;
}

// Test it
// scrapeIxigo('DEL', 'JAI', '08072025').then(console.log).catch(console.error);

module.exports = scrapeIxigo; // Make sure this is at the bottom