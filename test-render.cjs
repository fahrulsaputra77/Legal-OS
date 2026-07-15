const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let hasError = false;
  
  page.on('pageerror', err => {
    console.error('PAGE_ERROR:', err.toString());
    hasError = true;
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('CONSOLE_ERROR:', msg.text());
      hasError = true;
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  if (hasError) {
    console.log('RENDER_FAILED');
    process.exit(1);
  } else {
    console.log('RENDER_SUCCESS');
    process.exit(0);
  }
})();
