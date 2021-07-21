const NotebookPage = function () {

    const btnCloseNotebook = (fileName) => `li.lm-TabBar-tab[title*="Name: ${fileName}"] .lm-TabBar-tabCloseIcon`;
    const btnDiscard = '.jp-Dialog button.jp-Dialog-button.jp-mod-warn';
    const btnPlay = (id) => `div#${id} button.jp-ToolbarButtonComponent.jp-Button[title="Run the selected cells and advance"]`;
    const clsErrorOutput = '.jp-Cell-outputWrapper [data-mime-type="application/vnd.jupyter.stderr"]';
    const divCodeCell = '.jp-Notebook .jp-CodeCell';
    const divCellIdx = '.jp-InputArea-prompt';
    const tabNotebook = (fileName) => `li.lm-TabBar-tab[title*="Name: ${fileName}"]`;    

    const fileStatus = {
        Loaded: 'Formula Framework | Idle',
        Busy: 'Formula Framework | Busy',
    };

    const checkStatus = (fileName, status) => {
        return `//*[contains(@title,'Change kernel for ${fileName}')][contains(text(),'${status}')]`;
    };
    this.isFileLoaded = (fileName) => checkStatus(fileName, fileStatus.Loaded);
    this.isFileBusy = (fileName) => checkStatus(fileName, fileStatus.Busy);

    this.getCodeBlocks = async function (page) {
        return await page.$$(divCodeCell);
    };

    this.ifElementAction = async function (page, sel, action) {
        let isElement = '';
        try {
            isElement = await page.$eval(sel, el => {
                return (el) ? el.innerText : '';
            });
        }
        catch {};

        if (isElement) {
            return await action(this);
        };  
    };

    this.runCodeCell = async function (page, cell, fileName, tabId) {
        await cell.focus();
        await page.waitForSelector(btnPlay(tabId));
        await page.click(btnPlay(tabId));

        await this.ifElementAction(
            page,
            this.isFileBusy(fileName),
            async function (that) {
                await page.waitForSelector(that.isFileLoaded(fileName));
            }
        )      
    };

    this.getTabId = async function (page, fileName) {
        await page.waitForSelector(tabNotebook(fileName));
        let tab = await page.$(tabNotebook(fileName));
        let tabId = await page.evaluate(([tab]) => tab.getAttribute('data-id'), [tab]);
        return tabId;
    };

    this.closeFile = async function (page, fileName) {
        await page.click(btnCloseNotebook(fileName));
    };

    this.closeDialog = async function (page) {
        await this.ifElementAction(
            page,
            btnDiscard,
            async function (that) {
                await page.waitForSelector(btnDiscard);
                await page.click(btnDiscard);
            });
    };

    this.getCellIdx = async function(cell) {
        return await cell.$eval(divCellIdx, el => el.innerText);
    };

    /**
     * 
     * @param {ElementHandler} cell - runnable code cell
     * @returns - result of the cell run may contain computed result or an error message.
     * intentional verification of the error class presense could result in exception,
     * so it is wrapped with try-catch block
     * returns error message or empty
     */
    this.getCellError = async function(cell) {
        let isError = '';

        try {
            isError = await cell.$eval(clsErrorOutput, el => {
                return (el) ? el.innerText : '';
            });
        }
        catch {};

        return isError;
    };
}
export { NotebookPage };