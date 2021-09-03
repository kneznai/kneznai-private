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

        const oneDriveElement = await page.$(btnOneDrive);

        const isOneDriveOpen = await page.evaluate(([el, cls]) => {
            return el.classList.contains(cls)
        }, [oneDriveElement, clsMenuActive]);
        
        if (!isOneDriveOpen) {
            await page.click(btnOneDrive);
        };

        await page.waitForSelector(btnOneDriveLogin);
        await page.click(btnOneDriveLogin);
        await page.waitForSelector(btnLogOutIcon);

        // 3 - loading screen and click again on OneDrive menu
        await page.waitForSelector(oneDriveTreePanel);
    };
}
export { NavigateMenu };