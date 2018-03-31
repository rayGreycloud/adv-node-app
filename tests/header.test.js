const puppeteer = require('puppeteer');

// Testing 
test('Should launch a browser', async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  
  
  
});
