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
      from: getText('h4.h4.text-primary.mb-5.font-medium'),
      to: getText('h4.h4.text-primary.mb-5.font-medium'),
      // duration: getText('p.body-sm.text-secondary'),
      // duration: getText('["min-w-[60px] text-center mt-30"]'),
      duration: Array.from(document.querySelectorAll('p')).map(p => p.innerText).find(text => /\d+h \d+m/.test(text)) || '',
      cabinBaggage: getInfoByLabel('Cabin :'),
      checkinBaggage: getInfoByLabel('Check-in :'),
    };
  });

  await browser.close();
  return data;
}

// 🔍 Example usage
scrapeFlightDetail('https://www.ixigo.com/flight/booking/1044/1q4h30lhddpztvhhdhphphqhh96ohdppztptvdvswptztu?fareKey=DEL-BOM-IX1145-11062025&providers=1044&hbo=false&ftk=DEL%7CBOM%7C110625%7C%7C1%7C0%7C0%7Ce%7CINR%7C10062025153702628%241044%7CDEL-BOM-IX1145%7Cfalse%7Ctrue%7C9250171.09~7850.0~9257565.0~9257497.91~9249715.0~73563b08-9449-4652-b28a-5d6bbe29b82b&source=Search%20Form') // your full detail URL
  .then(console.log)
  .catch(console.error);