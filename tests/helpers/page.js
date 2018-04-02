const puppeteer = require('puppeteer');
const sessionFactory = require('.././factories/sessionFactory');
const userFactory = require('.././factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    });
    
    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }
  
  constructor(page) {
    this.page = page;
  }
  
  async login() {
    // Get user from user factory 
    const user = await userFactory();
    // Pass in user and get session 
    const { session, sig } = sessionFactory(user);
    // Set cookies 
    await this.page.setCookie({
      name: 'session',
      value: session
    });
    await this.page.setCookie({
      name: 'session.sig',
      value: sig
    });
    // Refresh and redirect
    await this.page.goto('localhost:3000/blogs');
    // Wait until element appears
    await this.page.waitFor('a[href="/auth/logout"]');    
  }
  
  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);    
  }
}

module.exports = CustomPage;
