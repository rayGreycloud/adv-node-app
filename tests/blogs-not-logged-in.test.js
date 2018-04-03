const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When not logged in', async () => {  

  test('User cannot create blog post', async () => {    
    const result = await page.post(
      '/api/blogs', 
      {
        title: 'Test Title',
        body: 'Test Content'
      }
    );
    
    expect(result).toEqual({ error: 'You must log in!' });
  });
  
  test('User cannot view list of blog posts', async () => {
    const result = await page.get('/api/blogs');
    
    expect(result).toEqual({ error: 'You must log in!' });     
  });
  
});
