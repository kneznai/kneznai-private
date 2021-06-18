import playwright from 'playwright';

let browser;
let context;
let page;

async function goto(url){
    await page.goto(url);
    return page;
};
async function run() {
    browser = await playwright.chromium.launch({
        headless: false,
        slowMo: 1000,
        timeout: 50000,
    });
    
    const options = {
        storageState: 'auth.json',
    };

    context = await browser.newContext(options);
    page = await context.newPage();
    return page;
};
async function stop() {
    await page.close();
    await browser.close();
};

export { goto, run, stop };