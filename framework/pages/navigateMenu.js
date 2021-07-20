const NavigateMenu = function () {
    const btnLogOutIcon = 'button .jp-OneDriveLogout';
    const btnOneDrive = 'li[title="OneDrive"]';
    const btnOneDriveLogin = '.jp-OneDriveLogin button';
    const btnTopPanel = '#jp-top-panel';
    const clsMenuActive = 'lm-mod-current';
    const oneDriveTreePanel = '#OneDriveBrowser';
    
    this.gotoOneDrive = async function (page) {
        // 1 - check for top panel to show
        await page.waitForSelector(btnTopPanel);
        //console.log('1');

        const oneDriveElement = await page.$(btnOneDrive);

        const isOneDriveOpen = await page.evaluate(([el, cls]) => {
            return el.classList.contains(cls)
        }, [oneDriveElement, clsMenuActive]);

        //console.log(isOneDriveOpen);
        
        if (!isOneDriveOpen) {
            await page.click(btnOneDrive);
            //console.log(8);
        };

        await page.waitForSelector(btnOneDriveLogin);
        await page.click(btnOneDriveLogin);
        //console.log('logged in oneDrive');
        await page.waitForSelector(btnLogOutIcon);
        //console.log('11');

        // 3 - loading screen and click again on OneDrive menu
        await page.waitForSelector(oneDriveTreePanel);
    };
}
export { NavigateMenu };