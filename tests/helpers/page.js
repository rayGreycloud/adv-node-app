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
  
  async get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json'
        }
      }).then(res => res.json());
    }, path);    
  }
  
  async post(path, data) {
    return this.page.evaluate((_path, _data) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(_data)
      }).then(res => res.json());
    }, path, data);
  }
  
  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
