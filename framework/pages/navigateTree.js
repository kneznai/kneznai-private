//import { clickToNavigate, getInlineInfo } from '../lib/helpers';

const NavigateTree = function () {
    this.dirNames = {
        name: "Education",
        children: {
            name: "Educational Notebooks",
            children: {},
        }
    };
    const dirSelector = (name) => `.jp-DirListing-item[title*="${name}"]`;
    
    this.gotoNotebooks = async function (page, dirs) {
        // 4 - wait for navigation tree to show and open core directory
        await page.waitForSelector(dirSelector(dirs.name));
        await page.dblclick(dirSelector(dirs.name));

        // 4.1 - navigate to next (sub)directory
        await page.waitForSelector(dirSelector(dirs.children.name));
        await page.dblclick(dirSelector(dirs.children.name));
    };
}
export { NavigateTree };