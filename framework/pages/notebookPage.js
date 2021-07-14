const NotebookPage = function () {

    const btnPlay = (id) => `div#${id} button.jp-ToolbarButtonComponent.jp-Button[title="Run the selected cells and advance"]`;
    const divCodeCell = '.jp-Notebook .jp-CodeCell';
    const divCellIdx = '.jp-InputArea-prompt';
    const clsErrorOutput = '.jp-Cell-outputWrapper [data-mime-type="application/vnd.jupyter.stderr"]';
    const btnCloseNotebook = (fileName) => `li.lm-TabBar-tab[title*="Name: ${fileName}"] .lm-TabBar-tabCloseIcon`;
    const tabNotebook = (fileName) => `li.lm-TabBar-tab[title*="Name: ${fileName}"]`;
    //const tabNotebook = (fileName) => `.jp-DirListing-content`;
    const btnDiscard = '.jp-Dialog button.jp-Dialog-button.jp-mod-warn';

    this.fileStatus = {
        Loaded: 'Formula Framework | Idle',
        Busy: 'Formula Framework | Busy',
    };

    this.checkStatus = (fileName, status) => {
        return `//*[contains(@title,'Change kernel for ${fileName}')][contains(text(),'${status}')]`;
    };
    this.isFileLoaded = (fileName) => this.checkStatus(fileName, this.fileStatus.Loaded);
    this.isFileBusy = (fileName) => this.checkStatus(fileName, this.fileStatus.Busy);

    this.getCodeBlocks = async function (page) {
        return await page.$$(divCodeCell);
    };

    this.runCodeCell = async function (page, cell, fileName, tabId) {
        await cell.focus();
        await page.waitForSelector(btnPlay(tabId));
        await page.click(btnPlay(tabId));

        let isBusy = '';
        try {
            const busySelector = this.isFileBusy(fileName);
            isBusy = await page.$eval(busySelector, el => {
                return (el) ? el.innerText : '';
            });
        }
        catch {};

        if (isBusy) {
            await page.waitForSelector(this.isFileLoaded(fileName));
        };        
    };

    this.getTabId = async function (page, fileName) {
        await page.waitForSelector(tabNotebook(fileName));
        let tab = await page.$(tabNotebook(fileName));
        let tabId = await page.evaluate(([tab]) => tab.getAttribute('data-id'), [tab]);
        //console.log(tabNotebook(fileName) + ' TabId: ' +tabId);
        return tabId;
    };

    this.closeFile = async function (page, fileName) {
        await page.click(btnCloseNotebook(fileName));
    };

    this.closeDialog = async function (page) {
        let isDialog = '';
        try {
            isDialog = await page.$eval(btnDiscard, el => {
                return (el) ? el.innerText : '';
            });
        }
        catch {};

        if (isDialog) {
            await page.waitForSelector(btnDiscard);
            await page.click(btnDiscard);
        };
    };

    this.getCellIdx = async function(cell) {
        return await cell.$eval(divCellIdx, el => el.innerText);
    };

    /**
     * 
     * @param {ElementHandler} cell - runnable cell with code
     * @returns - result of the cell run may contain computed result or an error message.
     * intentional verification of the error class presense could result in exception, so it is wrapped with try-catch block
     * returns error message or empty
     */
    this.getCellError = async function(cell) {
        let isError = '';

        try {
            // let input = await cell.$eval('.jp-Cell-inputWrapper', el => {
            //     return (el) ? el.innerText : '';
            // });
            // console.log(input);
            isError = await cell.$eval(clsErrorOutput, el => {
                return (el) ? el.innerText : '';
            });
        }
        catch {};

        return isError;
    };
}
export { NotebookPage };