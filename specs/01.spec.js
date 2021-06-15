const playwright = require("playwright");

describe ('notebooks', () => {
    it('tests authorization', async () => {
        browser = await playwright.chromium.launch({
            headless: false,
            slowMo: 1000,
        });
        
        context = await browser.newContext();
        page = await context.newPage();

        await page.goto('https://jupyter.systemorph.cloud/');

        await page.close();
        await browser.close();
    })
})