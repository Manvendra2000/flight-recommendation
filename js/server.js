const puppeteer = require('puppeteer'); // use full puppeteer, not puppeteer-core

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = 'https://www.ixigo.com/search/result/flight?from=DEL&to=BOM&date=09072025&adults=1&children=0&infants=0&class=e&source=Search+Form';
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForSelector('.airlineInfo');
  const flightHandles = await page.$$('.airlineInfo');

  const flights = [];

  for (let i = 0; i < flightHandles.length; i++) {
    try {
      const card = flightHandles[i];
      const root = await card.evaluateHandle(el => el.closest('.flex.items-start.w-full'));

      await card.click();

      // Wait longer for panel to open
      // await page.waitForSelector('[role="tabpanel"]', { timeout: 1000 });
      await page.waitForFunction(() =>
        [...document.querySelectorAll('div.flex.flex-col.space-y-10')]
          .some(div => div.innerText.includes('Baggage')),
        { timeout: 5000 }
      );

      const flightData = await page.evaluate(root => {
        const getText = (sel, base = document) => base.querySelector(sel)?.innerText || '';

        const airline = root.querySelector('[data-testid="airline-logo"]')?.alt || '';
        const flightNumber = root.querySelector('p.body-sm')?.innerText || '';

        const timeEls = root.querySelectorAll('.timeTileList');
        const depTime = getText('h6', timeEls[0]);
        const depAirport = getText('p', timeEls[0]);
        const arrTime = getText('h6', timeEls[1]);
        const arrAirport = getText('p', timeEls[1]);

        const duration = getText('.text-center > p.body-sm', root);
        const price = getText('[data-testid="pricing"]', root);

        // const getInfoByLabel = (labelText, base) => {
        //   const labelDiv = [...base.querySelectorAll('div')].find(el =>
        //     el.textContent?.includes(labelText)
        //   );
        //   return labelDiv?.textContent?.replace(labelText, '').trim() || '';
        // };
        const getBaggageInfo = (label) => {
          const baggageSection = [...document.querySelectorAll('div.flex.flex-col.space-y-10')]
            .find(div => div.innerText.includes('Baggage'));
          
          if (!baggageSection) return '';
        
          const row = [...baggageSection.querySelectorAll('div.flex.items-center')]
            .find(div => div.innerText.includes(label));
        
          return row?.querySelector('p.text-primary')?.innerText || '';
        };
        
        const cabinBaggage = getBaggageInfo('Cabin :');
        const checkinBaggage = getBaggageInfo('Check-in :');

        // const tabPanel = document.querySelector('[role="tabpanel"]');
        // const cabinBaggage = getInfoByLabel('Cabin :', tabPanel);
        // const checkinBaggage = getInfoByLabel('Check-in :', tabPanel);

        return {
          airline,
          flightNumber,
          depTime,
          depAirport,
          arrTime,
          arrAirport,
          duration,
          price,
          cabinBaggage,
          checkinBaggage
        };
      }, root);

      flights.push(flightData);

      // Close the tab panel by pressing ESC
      await page.keyboard.press('Escape');

      // Use native timeout instead of page.waitForTimeout
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.error('Error parsing flight:', err.message);
    }
  }

  console.log(flights);
  await browser.close();
})();