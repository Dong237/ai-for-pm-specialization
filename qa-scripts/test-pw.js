process.env.NO_PROXY = '*';
process.env.no_proxy = '*';
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  console.log('Playwright works!');
  await browser.close();
})();
