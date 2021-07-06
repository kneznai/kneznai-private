const NotebookPage = function () {

    const btnPlay = 'button.jp-ToolbarButtonComponent.jp-Button[title="Run the selected cells and advance"]';
    const divCodeCell = '.jp-Notebook .jp-CodeCell';
    const divCellIdx = '.jp-InputArea-prompt';
    const clsErrorOutput = '.jp-Cell-outputWrapper [data-mime-type="application/vnd.jupyter.stderr"]';

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

    this.runCodeCell = async function (page, cell, fileName) {
        await cell.focus();
        await page.waitForSelector(btnPlay);
        await page.click(btnPlay);
        await page.waitForSelector(this.isFileLoaded(fileName));
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
            isError = await cell.$eval(clsErrorOutput, el => {
                return (el) ? el.innerText : '';
            });
        }
        catch {};

        return isError;
    };
}
export { NotebookPage };