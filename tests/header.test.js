const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

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

test('Should show logout button when signed in', async () => {
  // Get user from user factory 
  const user = await userFactory();
  // Pass in user and get session 
  const { session, sig } = sessionFactory(user);
  // Set cookies 
  await page.setCookie({
    name: 'session',
    value: session
  });
  await page.setCookie({
    name: 'session.sig',
    value: sig
  });
  // Refresh page 
  await page.goto('localhost:3000');
  // 
  await page.waitFor('a[href="/auth/logout"]');
  // Get logout button
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  
  expect(text).toEqual('Logout');
});

