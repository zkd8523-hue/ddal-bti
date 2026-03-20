const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://link.coupang.com/a/b0b5kH', { waitUntil: 'networkidle2' });
  
  // Coupang redirects twice, so we just grab og:image from the final destination
  const imageUrl = await page.evaluate(() => {
    const meta = document.querySelector('meta[property="og:image"]');
    return meta ? meta.content : null;
  });
  
  if (imageUrl) {
    let finalUrl = imageUrl;
    if (finalUrl.startsWith('//')) {
      finalUrl = 'https:' + finalUrl;
    }
    console.log('Found image:', finalUrl);
    
    https.get(finalUrl, (res) => {
      const file = fs.createWriteStream('public/images/real_gel.jpg');
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Image downloaded successfully.');
        process.exit(0);
      });
    }).on('error', (err) => {
      console.error('Download error:', err);
      process.exit(1);
    });
  } else {
    console.log('No og:image found');
    process.exit(1);
  }
})();
