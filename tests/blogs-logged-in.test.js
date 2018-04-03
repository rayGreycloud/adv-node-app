const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {  
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('On button click, the new blog form should be shown', async () => {
    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');
  });  

  describe('When using valid form inputs', async () => {
    const testTitle = 'Test Blog Entry';
    const testContent = 'This is the content of the test blog entry.';

    beforeEach(async () =>{      
      await page.type('.title input', testTitle);
      await page.type('.content input', testContent);
      await page.click('form button');
    });

    test('On submit, the review screen should be shown', async () => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('On save, the new blog is added to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('.card-content p');

      expect(title).toEqual(testTitle);
      expect(content).toEqual(testContent);
    });
  });  

  describe('When using invalid form inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('The form should show an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});
