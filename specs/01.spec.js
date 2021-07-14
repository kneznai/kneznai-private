import { goto, run, stop } from '../framework/lib/driver/browser';
import { config } from '../framework/config/config';
import { app } from '../framework/pages/index';
import { clickToNavigate } from '../framework/lib/helpers';
// import chai from 'chai';
// const { expect } = chai;

function loadTree(filename) {
    const fs = require('fs'); 
    const path = require('path');

    const folderPath = path.join(__dirname, '../', filename);
    
    let folderTree = fs.readFileSync(folderPath, {encoding:'utf8', flag:'r'});
    
    return JSON.parse(folderTree);
}

let folderTree;
let notebookFolders = [];

folderTree = loadTree('folders.json');
const topFolder = app().NavigateTree().dirNames.children.name;
notebookFolders = folderTree.filter((entry) => entry.name === topFolder)[0].children.map((m) => [m.name, m.children]);

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

    beforeAll(async () => {
        await app().NavigateMenu().gotoOneDrive(page);

        const dirs = app().NavigateTree().dirNames;
        await app().NavigateTree().gotoNotebooks(page, dirs);
    });

    beforeAll(() => {
        // folderTree = loadTree('folders.json');
        // const topFolder = app().NavigateTree().dirNames.children.name;
        // notebookFolders = folderTree.filter((entry) => entry.name === topFolder)[0].children.map((m) => [m]);
    });

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

    //let notebookFolder = 'JupyterCourseSession1';
    
    describe.each(
        notebookFolders,
      )('folder %j files', (folderName, children) => {

        beforeEach(async () => {
            console.log(folderName);
            await app().NavigateTree().gotoFolder(page, folderName);
        });

        // let fileNames = [["CourseDataImportVideoEx3.ipynb"]];
        // beforeEach(async () => {
        //     fileNames = await app().NavigateTree().getFolderFiles(page);
        // });

        afterEach(async () => {
            await app().NavigateTree().gotoFolderUp(page);
        });

        //let fileNames = [["CourseDataImportVideoEx3.ipynb"]];
        let fileNames = children.map(m => [m.name]);

        describe.each(fileNames)('file %j', (fileName) => {

            beforeAll(async () => {
                //fileNames = await app().NavigateTree().getFolderFiles(page);
            });

            beforeEach(async () => {
                // 4.3 - wait for and open notebook file
                // console.log('5: '+ fileName);
                await app().NavigateTree().gotoFile(page, fileName);
            });

            afterEach(async () => {
                await app().NotebookPage().closeFile(page, fileName);
                await app().NotebookPage().closeDialog(page);
            });

            it('tests notebook cell by cell', async () => {

                await page.waitForSelector(app().NotebookPage().isFileLoaded(fileName));
                await page.waitForSelector('.jp-Notebook');

                // run notebook
                let tabId = await app().NotebookPage().getTabId(page, fileName);
                let codeCells = await app().NotebookPage().getCodeBlocks(page);
                // console.log(codeCells.length); number of code cells               
                        
                for (let i=0; i<codeCells.length; i++) {

                    let cell = codeCells[i];
                    await app().NotebookPage().runCodeCell(page, cell, fileName, tabId);
                    
                    let blockPrefix = `${await app().NotebookPage().getCellIdx(cell)}`;
                    let isError = await app().NotebookPage().getCellError(cell);

                    // in case of no error the expect will be true(pass) or throw detailed error message into console
                    // along with the failed cell index
                    expect(`${blockPrefix}${isError}`).toBe(`${blockPrefix}`);

                };

            });

        });
    });
})