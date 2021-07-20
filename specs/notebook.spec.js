import { goto, run, stop } from '../framework/lib/driver/browser';
import { config } from '../framework/config/config';
import { app } from '../framework/pages/index';
import { ifElement } from '../framework/lib/helpers/ifElementAction';

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

    afterAll(async () => {
        await stop();        
    });

    xit('tests authorization', async () => {
        const expectedUrl = `${config.url}user/${config.user}/lab`;
        const urlJupyter = await page.url();
        expect(urlJupyter).to.have.string(expectedUrl);
    })
    
    describe.each(
        notebookFolders,
      )('folder %j files', (folderName, children) => {
        
        beforeAll(async () => {
            console.log(folderName);
            await app().NavigateTree().gotoFolder(page, folderName);
        });

        afterAll(async () => {
            await app().NavigateTree().gotoFolderUp(page);
        });

        it('Check folder exists', async () => {
            let isFolder = await ifElement(page, app().NavigateTree().notebookFolderSelector(folderName));
            expect(isFolder).toBeTruthy();
        });

        let fileNames = children.map(m => [m.name]);

        describe.each(fileNames)('file %j', (fileName) => {

            beforeEach(async () => {
                // 4.3 - wait for and open notebook file
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

                }

            });

        });
    });
})