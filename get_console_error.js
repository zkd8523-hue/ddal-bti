const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 5000 });
  } catch (e) {
    console.log('GOTO ERROR:', e.message);
  }
  
  await browser.close();
})();
