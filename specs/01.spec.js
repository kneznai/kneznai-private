import { goto, run, stop } from '../framework/lib/driver/browser';
import { config } from '../framework/config/config';
import { app } from '../framework/pages/index';
import { clickToNavigate } from '../framework/lib/helpers';
// import chai from 'chai';
// const { expect } = chai;

describe ('notebooks', () => {
    let page;

    const btnPlay = 'button.jp-ToolbarButtonComponent.jp-Button[title="Run the selected cells and advance"]';

    const isFileLoadedStatus = 'Formula Framework | Idle';
    const isFileLoaded = (fileName) => `//*[contains(@title,'Change kernel for ${fileName}')][contains(text(),'${isFileLoadedStatus}')]`;
    const isFileBusyStatus = 'Formula Framework | Busy';
    const isFileBusy = (fileName) => `//*[contains(@title,'Change kernel for ${fileName}')][contains(text(),'${isFileBusyStatus}')]`;

    const getCodeCell = (n) => `//div[contains(@class, "jp-Notebook")]//div[contains(@class, "jp-CodeCell")][${n+1}]//div[contains(@class, "jp-Cell-outputWrapper")]`;

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

    xit('tests authorization', async () => {
        const expectedUrl = `${config.url}user/${config.user}/lab`;
        const urlJupyter = await page.url();
        expect(urlJupyter).to.have.string(expectedUrl);
    })

    xit('tests notebooks', async () => {
        // 1 - check for top panel to show
        await page.waitForSelector('#jp-top-panel');
        console.log('1');

        const isOneDriveOpen = await page.$eval('li[title="OneDrive"]', el => el.classList.contains('lm-mod-current'));

        console.log(isOneDriveOpen);
        
        if (!isOneDriveOpen) {
            await page.click('li[title="OneDrive"] .jp-OneDrive-icon');
            console.log(8);
        };

        await page.waitForSelector('.jp-OneDriveLogin button');
        await page.click('.jp-OneDriveLogin button');
        console.log('logged in oneDrive');
        await page.waitForSelector('#jp-top-panel');
        console.log('11');

        // 3 - loading screen and click again on OneDrive menu
        await page.waitForSelector('#OneDriveBrowser');
        //await page.click('li[title="OneDrive"] .jp-OneDrive-icon');

        // 4 - wait for navigation tree to show and open core directory
        await page.waitForSelector('.jp-DirListing-item[title*="Education"]');
        await page.dblclick('.jp-DirListing-item[title*="Education"]');

        // 4.1 - navigate to next (sub)directory
        await page.waitForSelector('.jp-DirListing-item[title*="Educational Notebooks"]');
        await page.dblclick('.jp-DirListing-item[title*="Educational Notebooks"]');

        // 4.2 - navigate to next (sub)directory
        await page.waitForSelector('.jp-DirListing-item[title*="JupyterCourseSession1"]');
        await page.dblclick('.jp-DirListing-item[title*="JupyterCourseSession1"]');

        // 4.3 - wait for and open notebook file
        console.log(5);
        const fileName = 'CourseDataImportVideoEx3.ipynb';
        const fileSelector = `.jp-DirListing-content .jp-DirListing-item[title*="${fileName}"]`;
        await page.waitForSelector(fileSelector);
        await page.dblclick(fileSelector);
        //await clickToNavigate(page, '.jp-DirListing-item[title*="JupyterCourseSession1"]');

        const isFileLoadedStatus = 'Formula Framework | Idle';
        const isFileLoaded = `//*[contains(@title,'Change kernel for ${fileName}')][contains(text(),'${isFileLoadedStatus}')]`;
        await page.waitForSelector(isFileLoaded);
        console.log(10);

        // run notebook
        await page.waitForSelector('button.jp-ToolbarButtonComponent.jp-Button[title="Restart the kernel, then re-run the whole notebook"]');
        await page.click('button.jp-ToolbarButtonComponent.jp-Button[title="Restart the kernel, then re-run the whole notebook"]');
        await page.waitForSelector('.jp-Dialog button.jp-Dialog-button.jp-mod-accept');
        await page.click('.jp-Dialog button.jp-Dialog-button.jp-mod-accept');        

        const isFileBusyStatus = 'Formula Framework | Busy';
        const isFileBusy = `//*[contains(@title,'Change kernel for ${fileName}')][contains(text(),'${isFileBusyStatus}')]`;
        await page.waitForSelector(isFileBusy, {timeout:3000});
        console.log(15);
        await page.waitForSelector(isFileLoaded, {timeout:3000});
        console.log(16);

        const errorOutput = '.jp-OutputArea.jp-Cell-outputArea .jp-OutputArea-output[data-mime-type*="jupyter.stderr"]';

        expect(await page.isVisible(errorOutput)).toBe(false);

        if (!page.isVisible(errorOutput)) {
            console.log(page.textContent(errorOutput)[0]);
        };

    });

    it('tests notebook cell by cell', async () => {

        await app().NavigateMenu().gotoOneDrive(page);

        const dirs = app().NavigateTree().dirNames;
        await app().NavigateTree().gotoNotebooks(page, dirs);

        // 4.2 - navigate to next (sub)directory
        await page.waitForSelector('.jp-DirListing-item[title*="JupyterCourseSession1"]');
        await page.dblclick('.jp-DirListing-item[title*="JupyterCourseSession1"]');

        // 4.3 - wait for and open notebook file
        console.log(5);
        const fileName = 'CourseDataImportVideoEx3.ipynb';
        const fileSelector = `.jp-DirListing-content .jp-DirListing-item[title*="${fileName}"]`;
        await page.waitForSelector(fileSelector);
        await page.dblclick(fileSelector);
        
        await page.waitForSelector(isFileLoaded(fileName));
        console.log(10);
        await page.waitForSelector('.jp-Notebook');


        // run notebook
        let codeCells = await page.$$('.jp-Notebook .jp-CodeCell');

        let output = '';
        
        for (let i=0; i<codeCells.length; i++) {

            let cell = codeCells[i];
            await cell.focus();
            await page.waitForSelector(btnPlay);
            await page.click(btnPlay);
            await page.waitForSelector(isFileLoaded(fileName));

            let blockIdx = await cell.$eval('.jp-InputArea-prompt', el => el.innerText);
            let isError = '';

            try {
                isError = await cell.$eval('.jp-Cell-outputWrapper [data-mime-type="application/vnd.jupyter.stderr"]', el => {
                    return (el) ? el.innerText : '';
                });
            }
            catch {};
        
            let blockPrefix = `${blockIdx}`;

            expect(`${blockPrefix}${isError}`).toBe(`${blockPrefix}`);

        };
    });
})