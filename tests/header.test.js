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

test.only('Should show logout button when signed in', async () => {
  // db user id
  const id = "5abd55ccba969806545e328a";
  // Create buffer instance
  const Buffer = require('safe-buffer').Buffer;
  // Create session object
  const sessionObject = {
    passport: {
      user: id
    }
  };
  // Create session string 
  const sessionString = Buffer.from(
    JSON.stringify(sessionObject)
  ).toString('base64');

  // Create signature 
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign(`session=${sessionString}`);
  // Set cookies 
  await page.setCookie({
    name: 'session',
    value: sessionString
  });
  await page.setCookie({
    name: 'session.sig',
    value: sig
  });
  // Refresh page 
  await page.goto('localhost:3000');
  
});

