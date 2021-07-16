import { ifElementAction } from '../lib/helpers/ifElementAction';

const NavigateTree = function () {
    this.dirNames = {
        name: "Education",
        children: {
            name: "Educational Notebooks",
            children: {},
        }
    };

    const breadcrumb = () => `#OneDriveBrowser .jp-FileBrowser-crumbs .jp-BreadCrumbs-item[title="${this.dirNames.name}/${this.dirNames.children.name}"]`;
    const dirSelector = (name) => `.jp-DirListing-item[title*="${name}"]`;
    const fileNamesSelector = '.jp-DirListing-content .jp-DirListing-item .jp-DirListing-itemText';
    this.getFileSelector = (fileName) => `.jp-DirListing-content .jp-DirListing-item[title*="${fileName}"]`;
    this.notebookFolderSelector = (name) => `.jp-DirListing-item[title*="${name}"]`;

    this.gotoNotebooks = async function (page, dirs) {
        // 4 - wait for navigation tree to show and open core directory
        await page.waitForSelector(dirSelector(dirs.name));
        await page.dblclick(dirSelector(dirs.name));

        // 4.1 - navigate to next (sub)directory
        await page.waitForSelector(dirSelector(dirs.children.name));
        await page.dblclick(dirSelector(dirs.children.name));
    };

    this.gotoFolder = async function (page, folder) {
        // 4.2 - navigate to next (sub)directory
        const folderSelector = this.notebookFolderSelector(folder);
        await ifElementAction(
            page,
            folderSelector,
            async function () {
                await page.waitForSelector(folderSelector);
                await page.dblclick(folderSelector);
            })
    };

    this.gotoFolderUp = async function (page) {
        await page.waitForSelector(breadcrumb());
        await page.click(breadcrumb());
    };

    this.gotoFile = async function (page, fileName) {
        const fileSelector = this.getFileSelector(fileName);
        await ifElementAction(
            page,
            fileSelector,
            async function () {
                await page.waitForSelector(fileSelector);
                await page.dblclick(fileSelector);
            })
    };

    this.getFolderFiles = async function (page) {
        const fileItems = await page.$$('.jp-DirListing-content .jp-DirListing-item');
        const fileNames = [];
        
        for (let i=0; i < fileItems.length; i++) {
            const itemText = await fileItems[i].$eval('.jp-DirListing-itemText', el => el.innerText);
            fileNames.push(itemText);
        };

        //('.jp-DirListing-content .jp-DirListing-item .jp-DirListing-itemText')[0]
        //const fileNames =  await page.$$eval(fileNamesSelector, el => el.innerText);
        console.log(fileNames);
        return fileNames.filter(s => s.indexOf(".ipynb") > 0).map(f =>[f]);
    };
}
export { NavigateTree };