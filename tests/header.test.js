const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  // Open tab
  page = await Page.build();
  // Navigate to app 
  await page.goto('localhost:3000');
});

afterEach(async () => {
  // Close browser
  await page.close();
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
  await page.login();
  
  // Get logout button
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  
  expect(text).toEqual('Logout');
});

