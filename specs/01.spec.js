import { goto, run, stop } from '../framework/lib/driver/browser';
import { config } from '../framework/config/config';
import { app } from '../framework/pages/index';
import { clickToNavigate } from '../framework/lib/helpers';
import chai from 'chai';
const { expect } = chai;

describe ('notebooks', () => {
    let page;

    const notebookUrl = config.url;
    const urls = {
        main: notebookUrl,
    }

    beforeAll(async () => {
        await run();
        page = await goto(urls.main);
    });
/*
    beforeAll(async () => {
        await app().MainPage().clickLogin(page);
        //const socialButtons = await app().MainPage().checkSocialButtons(page);
        //expect(socialButtons).to.have.string('Systemorph AAD');
        await page.waitForSelector('.claims-provider-list-buttons.social .options button#SystemorphAAD');
        console.log(app().MainPage().socialLogin);
        await clickToNavigate(page, '.claims-provider-list-buttons.social .options button#SystemorphAAD');
        await page.waitForSelector('input[name="loginfmt"]');
        await page.fill('input[name="loginfmt"]', config.email);
        await clickToNavigate(page, 'input[type="submit"]');
        await page.waitForSelector('#passwordInput');
        await page.fill('#passwordInput', config.password);
        await clickToNavigate(page, '#submitButton');
        //authentication app
        await page.waitForSelector('input[type="submit"]');
        await clickToNavigate(page, 'input[type="submit"]');
        await page.waitForSelector('svg[data-icon="ui-components:jupyter"]');
    });
*/
    afterAll(async () => {
        await stop();        
    });

    it('tests authorization', async () => {
        const expectedUrl = `${config.url}user/${config.user}/lab`;
        const urlJupyter = await page.url();
        expect(urlJupyter).to.have.string(expectedUrl);
    })

    it('tests notebooks', async () => {
        // 1 - check for top panel to show
        await page.waitForSelector('#jp-top-panel');

        // 2 - click on OneDrive side menu and login there
        await page.click('li[title="OneDrive"] .jp-OneDrive-icon');
        await page.waitForSelector('.jp-OneDriveLogin button.jp-Dialog-button');
        await clickToNavigate(page, '.jp-OneDriveLogin button.jp-Dialog-button');

        // 3 - loading screen and click again on OneDrive menu
        await page.waitForSelector('button[title="New Launcher"]');
        await page.click('li[title="OneDrive"] .jp-OneDrive-icon');

        // 4 - wait for navigation tree to show and open core directory
        await page.waitForSelector('.jp-DirListing-content .jp-DirListing-item');
        await page.click('.jp-DirListing-item[title*="Education"]');

        // 4.1 - navigate to next (sub)directory
        await page.waitForSelector('.jp-DirListing-item[title*="Educational Notebooks"]');
        await page.click('.jp-DirListing-item[title*="Educational Notebooks"]');

        // 4.2 - navigate to next (sub)directory
        await page.waitForSelector('.jp-DirListing-item[title*="JupyterCourseSession1"]');
        await page.click('.jp-DirListing-item[title*="JupyterCourseSession1"]');

        // 4.3 - wait for and open notebook file
        console.log(5);
        const fileSelector = '.jp-DirListing-content .jp-DirListing-item[title*="CourseDataImportVideoEx3.ipynb"]';
        await page.waitForSelector(fileSelector);
        await page.click(fileSelector);
        await page.dblclick(fileSelector);
        //await clickToNavigate(page, '.jp-DirListing-item[title*="JupyterCourseSession1"]');

        

        
    });
})