const puppeteer = require('puppeteer');
let brower;
let page;

beforeEach(async () => {
  // Create browser
  browser = await puppeteer.launch({
    headless: false
  });
  // Open tab
  page = await browser.newPage();
  // Navigate to app 
  await page.goto('localhost:3000');
});

afterEach(async () => {
  // Close browser
  await browser.close();
});

test('Should have correct text in header', async () => {
  // Get element text 
  const text  = await page.$eval('a.brand-logo', el => el.innerHTML);
  // Check value 
  expect(text).toEqual('Blogster');
});

test('Should start oauth flow when login clicked', async () => {
  // 'Click' on login 
  await page.click('.right a');
  // Get page url 
  const url = await page.url();
  // Check url 
  expect(url).toMatch(/accounts\.google\.com/);
});



