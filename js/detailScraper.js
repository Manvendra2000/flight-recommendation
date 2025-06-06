const puppeteer = require('puppeteer');

async function scrapeFlightDetail(url) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 30 });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="airline-number"]', { timeout: 60000 });

  const data = await page.evaluate(() => {
    const getText = (selector) =>
      document.querySelector(selector)?.innerText.trim() || '';

    const getInfoByLabel = (labelText) => {
      const blocks = Array.from(document.querySelectorAll('.flex.items-center'));
      for (const block of blocks) {
        if (block.innerText.includes(labelText)) {
          return block.querySelector('p.text-primary')?.innerText.trim() || '';
        }
      }
      return '';
    };

    return {
      airline: getText('[data-testid="airline-number"]').split('|')[0]?.trim(),
      flightNumber: getText('[data-testid="airline-number"]').split('|')[1]?.trim(),
      from: getText('.min-w-[140px].text-left h4'),
      to: getText('.text-right.w-[140px] h4'),
      duration: getText('.min-w-[60px].text-center p'),
      cabinBaggage: getInfoByLabel('Cabin :'),
      checkinBaggage: getInfoByLabel('Check-in :'),
    };
  });

  await browser.close();
  return data;
}

// 🔍 Example usage
scrapeFlightDetail('https://www.ixigo.com/flight/booking/1044/1q4h30lhpupztvhhdhphphqhh96ohpzpztptvdtvudvdkv?fareKey=DEL-BOM-AI2421-08062025&providers=1044&hbo=false&ftk=DEL%7CBOM%7C080625%7C%7C1%7C0%7C0%7Ce%7CINR%7C06062025125815145%241044%7CDEL-BOM-AI2421%7Cfalse%7Ctrue%7C9250190.61~7278.0~9256993.0~9256906.39~9249715.0~b5e47c78-27d2-4d3b-a65b-ea2bd9c6a60e&source=Search%20Form') // your full detail URL
  .then(console.log)
  .catch(console.error);